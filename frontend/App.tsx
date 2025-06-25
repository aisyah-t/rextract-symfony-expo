import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';

interface ApiResponse {
  message: string;
  status: string;
  timestamp: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
}

export default function App() {
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHelloWorld = async () => {
    setLoading(true);
    try {
      // Call the backend API
      const response = await fetch('http://localhost:8080');
      const data: ApiResponse = await response.json();
      setApiResponse(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data from backend');
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically fetch data when component mounts
    fetchHelloWorld();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rextract Frontend</Text>
      
      <Button 
        title={loading ? "Loading..." : "Fetch Hello World"} 
        onPress={fetchHelloWorld}
        disabled={loading}
      />

      {apiResponse && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseTitle}>Backend Response:</Text>
          <Text style={styles.responseText}>Message: {apiResponse.message}</Text>
          <Text style={styles.responseText}>Status: {apiResponse.status}</Text>
          <Text style={styles.responseText}>Time: {apiResponse.timestamp.date}</Text>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  responseContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    width: '100%',
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  responseText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
});
