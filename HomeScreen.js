// import React, { useState, useRef } from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   Text,
//   ScrollView,
//   ImageBackground,
// } from 'react-native';
// import MapView from 'react-native-maps';
// import { launchImageLibrary } from 'react-native-image-picker';
// import axios from 'axios';
// import ViewShot from 'react-native-view-shot';

// const HomeScreen = ({ navigation }) => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [region, setRegion] = useState({
//     latitude: 23.5937,
//     longitude: 80.9629,
//     latitudeDelta: 30.0,
//     longitudeDelta: 28.0,
//   });
//   const backgroundImage = require('./image.jpg');
//   const viewShotRef = useRef();

//   const captureScreenshot = async () => {
//     setLoading(true);
//     try {
//       const uri = await viewShotRef.current.capture();
//       setSelectedImage(uri);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error capturing screenshot:', error);
//       Alert.alert('Error', 'Failed to capture screenshot!');
//       setLoading(false);
//     }
//   };

//   const pickImage = async () => {
//     const options = { mediaType: 'photo', quality: 1 };
//     launchImageLibrary(options, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.errorMessage) {
//         Alert.alert('Error', 'Failed to pick image');
//       } else {
//         setSelectedImage(response.assets[0].uri);
//       }
//     });
//   };

//   const processImage = async () => {
//     if (!selectedImage) {
//       Alert.alert('No Image Selected', 'Please select or capture an image first!');
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append('image', {
//       uri: selectedImage,
//       name: 'image.png',
//       type: 'image/png',
//     });

//     try {
//       const response = await axios.post('https://8359-2401-4900-6744-9775-d563-3b50-d97-e652.ngrok-free.app/process-image', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         responseType: 'blob',
//       });

//       const reader = new FileReader();
//       reader.onload = () => {
//         setLoading(false);
//         navigation.navigate('Results', {
//           beforeImage: selectedImage,
//           afterImage: reader.result,
//         });
//       };
//       reader.readAsDataURL(response.data);
//     } catch (error) {
//       console.error('Processing error:', error);
//       Alert.alert('Error', 'Failed to process image!');
//       setLoading(false);
//     }
//   };

//   return (
//     <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.container}>
//           <Text style={styles.title}>Realtime Paddy mapping{'\n'}Using GEE</Text>
//           <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1 }} style={styles.mapContainer}>
//             <MapView
//               style={styles.map}
//               region={region}
//               onRegionChangeComplete={setRegion}
//               mapType="satellite"
//             />
//           </ViewShot>
//           {selectedImage && (
//             <Image source={{ uri: selectedImage }} style={styles.image} />
//           )}
//           <View style={styles.buttonGroup}>
//             <TouchableOpacity style={styles.button} onPress={captureScreenshot}>
//               <Text style={styles.buttonText}>Capture</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} onPress={pickImage}>
//               <Text style={styles.buttonText}>Pick an Image</Text>
//             </TouchableOpacity>
//           </View>
//           <TouchableOpacity style={[styles.button, styles.processButton]} onPress={processImage}>
//             <Text style={styles.buttonText}>Process Image</Text>
//           </TouchableOpacity>
//           {loading && <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />}
//         </View>
//       </ScrollView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: { flex: 1, width: '100%', height: '100%' },
//   scrollContainer: { flexGrow: 1, padding: 20 },
//   container: { alignItems: 'center' },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginVertical: 16,
//     color: '#FFF',
//     textAlign: 'center',
//     textShadowColor: '#000',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   mapContainer: { width: '100%', height: 300, marginBottom: 16, borderRadius: 10, overflow: 'hidden' },
//   map: { width: '100%', height: '100%' },
//   buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 },
//   button: {
//     flex: 1,
//     marginHorizontal: 8,
//     paddingVertical: 12,
//     borderRadius: 8,
//     backgroundColor: '#00897B',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   processButton: { backgroundColor: '#1E88E5',width:150 ,marginBottom:150},
//   loader: { marginVertical: 16 },
//   image: { width: '100%', height: 300, borderRadius: 10, marginVertical: 16 },
// });

// export default HomeScreen;
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  ScrollView,
  ImageBackground,
} from 'react-native';
import MapView from 'react-native-maps';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import ViewShot from 'react-native-view-shot';
import { firebase, auth } from './firebaseConfig';

const HomeScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState({
    latitude: 23.5937,
    longitude: 80.9629,
    latitudeDelta: 30.0,
    longitudeDelta: 28.0,
  });
  const backgroundImage = require('./image8.jpg');
  const viewShotRef = useRef();

  // Check authentication on component mount
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        Alert.alert('Authentication Required', 'Please log in first.');
        navigation.replace('Login');
      }
    });
    return unsubscribe;
  }, [navigation]);

  const captureScreenshot = async () => {
    setLoading(true);
    try {
      const uri = await viewShotRef.current.capture();
      setSelectedImage(uri);
      setLoading(false);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      Alert.alert('Error', 'Failed to capture screenshot!');
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const options = { mediaType: 'photo', quality: 1 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        Alert.alert('Error', 'Failed to pick image');
      } else {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };

  const processImage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image Selected', 'Please select or capture an image first!');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', {
      uri: selectedImage,
      name: 'image.png',
      type: 'image/png',
    });

    try {
      const response = await axios.post(
        'https://96d5-2401-4900-6583-e362-5c9-4d9-c8f3-8b8b.ngrok-free.app/process-image',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          responseType: 'blob',
        }
      );

      const reader = new FileReader();
      reader.onload = () => {
        setLoading(false);
        navigation.navigate('Results', {
          beforeImage: selectedImage,
          afterImage: reader.result,
        });
      };
      reader.readAsDataURL(response.data);
    } catch (error) {
      console.error('Processing error:', error);
      Alert.alert('Error', 'Failed to process image!');
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Realtime Paddy Mapping{'\n'}Using GEE</Text>
          <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1 }} style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={region}
              onRegionChangeComplete={setRegion}
              mapType="satellite"
            />
          </ViewShot>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          )}
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={captureScreenshot}>
              <Text style={styles.buttonText}>Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.buttonText}>Pick an Image</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.button, styles.processButton]} onPress={processImage}>
            <Text style={styles.buttonText}>Process Image</Text>
          </TouchableOpacity>
          {loading && <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  scrollContainer: { flexGrow: 1, padding: 20 },
  container: { alignItems: 'center' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  mapContainer: { width: '100%', height: 300, marginBottom: 16, borderRadius: 10, overflow: 'hidden' },
  map: { width: '100%', height: '100%' },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 },
  button: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#00897B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  processButton: { backgroundColor: '#1E88E5', width: 150, marginBottom: 150 },
  loader: { marginVertical: 16 },
  image: { width: '100%', height: 300, borderRadius: 10, marginVertical: 16 },
});

export default HomeScreen;
