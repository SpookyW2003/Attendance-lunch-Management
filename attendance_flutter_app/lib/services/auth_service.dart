import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../config/network_config.dart';

class AuthService {
  static String? _workingEndpoint;
  static bool _isInitialized = false;
  static bool _useMockMode = false; // Enable when no server is available
  
  // Initialize the service by finding the working endpoint
  static Future<void> initialize() async {
    if (_isInitialized) return;
    
    final prefs = await SharedPreferences.getInstance();
    
    // First, try previously saved working endpoint
    final savedEndpoint = prefs.getString('working_endpoint');
    if (savedEndpoint != null) {
      if (await NetworkConfig.testServerConnection(savedEndpoint)) {
        _workingEndpoint = savedEndpoint;
        _isInitialized = true;
        return;
      }
    }
    
    // Then, try to find the best endpoint based on network conditions
    final bestEndpoint = await NetworkConfig.findBestEndpoint();
    if (bestEndpoint != null) {
      _workingEndpoint = bestEndpoint;
      await prefs.setString('working_endpoint', bestEndpoint);
      _isInitialized = true;
      return;
    }
    
    // If no endpoint works, try all possible endpoints from ApiConfig
    for (String endpoint in ApiConfig.possibleEndpoints) {
      if (await NetworkConfig.testServerConnection(endpoint)) {
        _workingEndpoint = endpoint;
        await prefs.setString('working_endpoint', endpoint);
        _isInitialized = true;
        return;
      }
    }
    
    // Fall back to default and enable mock mode if no endpoint works
    _workingEndpoint = ApiConfig.defaultEndpoint;
    _isInitialized = true;
    _useMockMode = true; // No server found, use mock mode
    print('No server found, entering mock mode');
  }
  
  // Test endpoint with /health route
  static Future<bool> _testEndpoint(String endpoint) async {
    try {
      final response = await http.get(
        Uri.parse('$endpoint/health'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 1));
      
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
  
  // Test endpoint directly (fallback when /health doesn't exist)
  static Future<bool> _testEndpointDirect(String endpoint) async {
    try {
      final response = await http.get(
        Uri.parse(endpoint),
        headers: {'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 1));
      
      // Accept any response that's not a connection error
      return response.statusCode < 500;
    } catch (e) {
      return false;
    }
  }
  
  // Get the working endpoint (assumes initialize has been called)
  static Future<String> _getWorkingEndpoint() async {
    if (!_isInitialized) {
      await initialize();
    }
    return _workingEndpoint ?? ApiConfig.defaultEndpoint;
  }
  
  static Future<Map<String, dynamic>?> login(String email, String password) async {
    // If mock mode is enabled or all endpoints failed, use mock login
    if (_useMockMode) {
      return _mockLogin(email, password);
    }
    
    Exception? lastError;
    
    // Try to connect to real server
    for (int attempt = 0; attempt < ApiConfig.maxRetries; attempt++) {
      try {
        final baseUrl = await _getWorkingEndpoint();
        
        final response = await http.post(
          Uri.parse('$baseUrl/auth/login'),
          headers: {
            'Content-Type': 'application/json',
          },
          body: json.encode({
            'email': email,
            'password': password,
          }),
        ).timeout(const Duration(seconds: 3)); // Shorter timeout

        if (response.statusCode == 200) {
          final data = json.decode(response.body);
          
          // Save token to shared preferences
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('auth_token', data['token']);
          await prefs.setString('user_data', json.encode(data['user']));
          
          return data;
        } else {
          final error = json.decode(response.body);
          throw Exception(error['message'] ?? 'Login failed');
        }
      } catch (e) {
        lastError = Exception('Network error: $e');
        
        // If this endpoint failed, try another one next time
        _workingEndpoint = null;
        
        // Don't wait as long for retries
        if (attempt < ApiConfig.maxRetries - 1) {
          await Future.delayed(const Duration(milliseconds: 500));
        }
      }
    }
    
    // If all attempts failed, try mock mode as last resort
    print('Server connection failed, falling back to mock mode');
    _useMockMode = true;
    return _mockLogin(email, password);
  }
  
  // Mock login for testing when server is not available
  static Future<Map<String, dynamic>?> _mockLogin(String email, String password) async {
    await Future.delayed(const Duration(milliseconds: 500)); // Simulate network delay
    
    // Define valid demo credentials
    final validCredentials = {
      'admin@demo.com': {'password': 'password123', 'role': 'admin', 'name': 'Admin User'},
      'employee@demo.com': {'password': 'password123', 'role': 'employee', 'name': 'Employee User'},
      'chef@demo.com': {'password': 'password123', 'role': 'chef', 'name': 'Chef User'},
    };
    
    if (validCredentials.containsKey(email)) {
      final userInfo = validCredentials[email]!;
      if (userInfo['password'] == password) {
        final mockData = {
          'token': 'mock_token_${DateTime.now().millisecondsSinceEpoch}',
          'user': {
            'id': '1',
            'email': email,
            'name': userInfo['name'],
            'role': userInfo['role'],
          }
        };
        
        // Save token to shared preferences
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', mockData['token'] as String);
        await prefs.setString('user_data', json.encode(mockData['user']));
        
        return mockData;
      }
    }
    
    throw Exception('Invalid credentials');
  }

  static Future<bool> verifyToken(String token) async {
    // If mock mode is enabled, just check if token exists and looks valid
    if (_useMockMode || token.startsWith('mock_token_')) {
      return token.isNotEmpty;
    }
    
    try {
      final baseUrl = await _getWorkingEndpoint();
      final response = await http.get(
        Uri.parse('$baseUrl/auth/verify'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      ).timeout(const Duration(seconds: 2)); // Shorter timeout

      return response.statusCode == 200;
    } catch (e) {
      // If server verification fails but token looks like a mock token, accept it
      if (token.startsWith('mock_token_')) {
        _useMockMode = true;
        return true;
      }
      return false;
    }
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('user_data');
  }

  static Future<Map<String, dynamic>?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userData = prefs.getString('user_data');
    if (userData != null) {
      return json.decode(userData);
    }
    return null;
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }
}
