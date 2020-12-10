import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import auth , { FirebaseAuthTypes }from '@react-native-firebase/auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';


export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    auth().onAuthStateChanged(userState => {
      setUser(userState);
      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider  >
        <Navigation colorScheme={colorScheme}  />
        <StatusBar />
      </SafeAreaProvider >
    );
  }
}


