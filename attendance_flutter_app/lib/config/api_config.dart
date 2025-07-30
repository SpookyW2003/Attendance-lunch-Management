class ApiConfig {
  // List of possible API endpoints to try (ordered by likelihood of success)
  static const List<String> possibleEndpoints = [
    'http://192.168.1.8:5000/api',  // Your local server IP
    'http://192.168.0.8:5000/api',  // Alternative common router IP range
    'http://192.168.43.1:5000/api', // Mobile hotspot IP
    'http://10.0.0.8:5000/api',     // Another common IP range
    'http://172.16.0.8:5000/api',   // Corporate network range
    'http://10.0.2.2:5000/api',     // Android emulator host
    'http://localhost:5000/api',    // Local development
    'http://127.0.0.1:5000/api',    // Local loopback
  ];
  
  // Default endpoint
  static const String defaultEndpoint = 'http://192.168.1.8:5000/api';
  
  // Timeout configuration (reduced for faster discovery)
  static const Duration connectionTimeout = Duration(seconds: 8);
  static const Duration receiveTimeout = Duration(seconds: 12);
  
  // Retry configuration
  static const int maxRetries = 3;
  static const Duration retryDelay = Duration(seconds: 1);
}
