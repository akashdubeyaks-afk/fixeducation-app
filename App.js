import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';
import * as SplashScreen from 'expo-splash-screen';
import NoInternet from './NoInternet';

// Keep the splash screen visible while we load
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isConnected, setIsConnected] = useState(true);
  const [isStatusBarHidden, setIsStatusBarHidden] = useState(false);
  const webViewRef = useRef(null);

  // You can change this to your local IP for testing without ngrok, e.g., 'http://192.168.x.x/fixeducation'
  // Or use the ngrok URL from your bat file
  const websiteUrl = 'https://grumbling-chooser-dinner.ngrok-free.dev/fixeducation/';

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable !== false);
    });
    
    // Hide splash screen after a delay to ensure it shows nicely
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);

    return () => unsubscribe();
  }, []);

  const injectedJavaScript = `
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'scroll', direction: 'down' }));
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'scroll', direction: 'up' }));
      }
      lastScrollY = currentScrollY;
    });
    true; // note: this is required, or you'll sometimes get silent failures
  `;

  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'scroll') {
        if (data.direction === 'down' && !isStatusBarHidden) {
          setIsStatusBarHidden(true);
        } else if (data.direction === 'up' && isStatusBarHidden) {
          setIsStatusBarHidden(false);
        }
      }
    } catch (e) {
      console.log('Error parsing message from webview:', e);
    }
  };

  if (!isConnected) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <NoInternet />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar 
        hidden={isStatusBarHidden}
        translucent={true} 
        backgroundColor="transparent" 
        barStyle="light-content"
        animation="slide"
      />
      <WebView
        ref={webViewRef}
        source={{ uri: websiteUrl }}
        style={styles.webview}
        injectedJavaScript={injectedJavaScript}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030a0b',
  },
  webview: {
    flex: 1,
    backgroundColor: '#030a0b',
  },
});
