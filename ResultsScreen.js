import React from 'react';
import { View, Image, StyleSheet, Text, ScrollView } from 'react-native';

const ResultsScreen = ({ route }) => {
  const { beforeImage, afterImage } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Processed Results</Text>
      <Image source={{ uri: beforeImage }} style={styles.image} />
      <Text style={styles.label}>Original Image</Text>
      <Image source={{ uri: afterImage }} style={styles.image} />
      <Text style={styles.label}>Processed Image</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', backgroundColor: '#F5F5F5', flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#212121' },
  image: { width: '100%', height: 300, marginBottom: 16, borderRadius: 10 },
  label: { fontSize: 16, color: '#757575', marginBottom: 10 },
});

export default ResultsScreen;
