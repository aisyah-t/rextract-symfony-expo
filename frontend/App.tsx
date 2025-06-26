import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';


interface ExtractionResponse {
  text: string;
}

type SelectedImageAsset = ImagePicker.ImagePickerAsset;

export default function App() {
  const [extractionResponse, setExtractionResponse] = useState<ExtractionResponse | null>(null);
  const [selectedImageAsset, setSelectedImageAsset] = useState<SelectedImageAsset | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePickImage = async () => {
 
    const { granted: isMediaLibraryPermissionGranted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!isMediaLibraryPermissionGranted) {
      Alert.alert('Permission needed', 'We need permission to access media on your device');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImageAsset(result.assets[0]);
    }
  };

  const handleTextExtraction = async () => {
    if (!selectedImageAsset) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    setUploading(true);

    try {
  
      const { uri, mimeType, fileName, file } = selectedImageAsset;
      const name = file?.name ?? fileName ?? 'recipe.jpg';
      const type = mimeType ?? file?.type ?? 'image/jpeg';

      const formData = new FormData();
      // Handle base64 data URI (for Expo Web)
      if (uri.startsWith('data:')) {
        // Convert base64 data URI to blob
        const response = await fetch(uri);
        const blob = await response.blob();

        const fileObject = new File([blob],  name, { type: blob.type });

        formData.append('image', fileObject);
      } else {
        // Handle regular file URI (for iOS/Android file system)
        const fileObject = {
          uri,
          type,
          name
        };

        // FormData.append method in React Native is polyfilled to accept an object with { uri, type, name } as a "file" for uploads.
        // To satisfy Typescript we need to cast it to Blob to append it to the form data.
        formData.append('image', fileObject as unknown as Blob);
      }

      // Upload to backend
      const response = await fetch('http://localhost:8080/recipes/extract-recipe-from-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ExtractionResponse = await response.json();
      setExtractionResponse(data);
    } catch (error) {
      Alert.alert('Upload Error', 'Failed to upload image and extract text');
      console.error('Upload Error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Rextract</Text>
      <Text style={styles.sectionTitle}>Recipe Image Upload</Text>
      <View style={styles.uploadSection}>
        <View style={styles.buttonRow}>
          <Button title="Pick Image" onPress={handlePickImage} />
        </View>
        {selectedImageAsset && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImageAsset.uri }} style={styles.image} />
            <Button 
              title={uploading ? "Extracting..." : "Extract Recipe"} 
              onPress={handleTextExtraction}
              disabled={uploading}
            />
          </View>
        )}
        {extractionResponse && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseTitle}>Extracted Text:</Text>
            <Text style={styles.responseText}>{extractionResponse.text}</Text>
          </View>
        )}
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  uploadSection: {
    marginBottom: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 500,
    height: 500,
    marginBottom: 15,
    borderRadius: 10,
  },
  responseContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  responseText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
    lineHeight: 20,
  },
});
