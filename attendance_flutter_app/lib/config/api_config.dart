class ApiConfig {
  // List of possible API endpoints to try
  static const List<String> possibleEndpoints = [
    'http://192.168.1.8:5000/api',
    'http://localhost:5000/api',
    'http://127.0.0.1:5000/api',
    'http://10.0.2.2:5000/api', // Android emulator host
  ];
  
  // Default endpoint
  static const String defaultEndpoint = 'http://192.168.1.8:5000/api';
  
  // Timeout configuration
  static const Duration connectionTimeout = Duration(seconds: 10);
  static const Duration receiveTimeout = Duration(seconds: 15);
  
  // Retry configuration
  static const int maxRetries = 3;
  static const Duration retryDelay = Duration(seconds: 2);
}
