import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';

class AuthService {
  static String? _workingEndpoint;
  
  // Get the working endpoint or find one
  static Future<String> _getWorkingEndpoint() async {
    if (_workingEndpoint != null) {
      return _workingEndpoint!;
    }
    
    // Try to find a working endpoint
    for (String endpoint in ApiConfig.possibleEndpoints) {
      try {
        final response = await http.get(
          Uri.parse('$endpoint/health'),
          headers: {'Content-Type': 'application/json'},
        ).timeout(const Duration(seconds: 5));
        
        if (response.statusCode == 200) {
          _workingEndpoint = endpoint;
          
          // Save working endpoint for future use
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('working_endpoint', endpoint);
          
          return endpoint;
        }
      } catch (e) {
        // Continue to next endpoint
        continue;
      }
    }
    
    // If no endpoint works, try to load previously saved one
    final prefs = await SharedPreferences.getInstance();
    final savedEndpoint = prefs.getString('working_endpoint');
    if (savedEndpoint != null) {
      _workingEndpoint = savedEndpoint;
      return savedEndpoint;
    }
    
    // Fall back to default
    return ApiConfig.defaultEndpoint;
  }
  
  static Future<Map<String, dynamic>?> login(String email, String password) async {
    Exception? lastError;
    
    // Try multiple times with different endpoints
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
        ).timeout(ApiConfig.connectionTimeout);

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
        
        // Wait before retrying
        if (attempt < ApiConfig.maxRetries - 1) {
          await Future.delayed(ApiConfig.retryDelay);
        }
      }
    }
    
    throw lastError ?? Exception('Unable to connect to server after multiple attempts');
  }

  static Future<bool> verifyToken(String token) async {
    try {
      final baseUrl = await _getWorkingEndpoint();
      final response = await http.get(
        Uri.parse('$baseUrl/auth/verify'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      ).timeout(ApiConfig.connectionTimeout);

      return response.statusCode == 200;
    } catch (e) {
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
