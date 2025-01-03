import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import ResultsScreen from './ResultsScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import WelcomeScreen from './WelcomeScreen';  // Import the new WelcomeScreen

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        {/* Welcome Screen */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        
        {/* Login Screen */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* Sign-Up Screen */}
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        
        {/* Home Screen */}
        <Stack.Screen name="Home" component={HomeScreen} />
        
        {/* Results Screen */}
        <Stack.Screen name="Results" component={ResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
