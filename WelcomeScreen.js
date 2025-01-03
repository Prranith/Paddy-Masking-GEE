import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground 
    // source = {{uri:"data:image/jpeg;base64,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"}}
      source={require('./image6.png')} // Update with your background image path
      style={styles.container}
    >
      {/* <Text style={styles.title}>Welcome to Our App!</Text> */}
      {/* <Text style={styles.subtitle}>Let's get started by signing up.</Text> */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      
      {/* Google Earth Engine Logo and Text */}
      <View style={styles.footer}>
        <Image 
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRylCEh6uCz6nIrsMjjW3cc73lNAaD32LoSDg&s' }} 
          style={styles.logo}
        />
        <Text style={styles.developedBy}>© 2024 Google Earth Engine. All rights reserved.{'\n'}Developed by Prranith</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
     // Padding on the sides for responsive layout
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',  // White color for the title
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',  // White color for subtitle to stand out
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#1E88E5',  // Primary button color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 30,  // Adding a subtle shadow effect for iOS
    shadowColor: '#000',  // Shadow for iOS devices
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginTop: 450,
    height:52,
    width:180
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 40,
    resizeMode: 'contain',  // Ensures the logo retains its aspect ratio
    marginBottom: 10,
  },
  poweredBy: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  developedBy: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
});

export default WelcomeScreen;
