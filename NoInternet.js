import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function NoInternet() {
  return (
    <View style={styles.container}>
      <Feather name="wifi-off" size={64} color="#139a9c" />
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.subtitle}>Please check your network settings and try again.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030a0b',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    color: '#8da6a6',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
