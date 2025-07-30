import 'dart:io';
import 'package:http/http.dart' as http;

class NetworkConfig {
  // Get dynamic server endpoints based on device network
  static Future<List<String>> getDynamicEndpoints() async {
    List<String> endpoints = [];
    
    try {
      // Get device's network interfaces
      final interfaces = await NetworkInterface.list();
      
      for (var interface in interfaces) {
        for (var addr in interface.addresses) {
          if (addr.type == InternetAddressType.IPv4 && !addr.isLoopback) {
            // Extract network segment and try common server IPs
            final segments = addr.address.split('.');
            if (segments.length == 4) {
              final networkBase = '${segments[0]}.${segments[1]}.${segments[2]}';
              
              // Try common server IPs in the same network
              endpoints.addAll([
                'http://$networkBase.1:5000/api',   // Router IP
                'http://$networkBase.8:5000/api',   // Your server IP pattern
                'http://$networkBase.10:5000/api',  // Common server IP
                'http://$networkBase.100:5000/api', // Common server IP
                'http://$networkBase.2:5000/api',   // Alternative router IP
              ]);
            }
          }
        }
      }
      
      // Remove duplicates
      endpoints = endpoints.toSet().toList();
      
    } catch (e) {
      print('Error getting network interfaces: $e');
    }
    
    return endpoints;
  }
  
  // Test if a server is reachable
  static Future<bool> testServerConnection(String endpoint) async {
    try {
      final response = await http.get(
        Uri.parse('$endpoint/health'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 2));
      
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
  
  // Find the best server endpoint
  static Future<String?> findBestEndpoint() async {
    // First try static endpoints
    final staticEndpoints = [
      'http://192.168.1.8:5000/api',
      'http://192.168.0.8:5000/api',
      'http://10.0.0.8:5000/api',
    ];
    
    for (String endpoint in staticEndpoints) {
      if (await testServerConnection(endpoint)) {
        return endpoint;
      }
    }
    
    // Then try dynamic endpoints
    final dynamicEndpoints = await getDynamicEndpoints();
    for (String endpoint in dynamicEndpoints) {
      if (await testServerConnection(endpoint)) {
        return endpoint;
      }
    }
    
    return null;
  }
}
