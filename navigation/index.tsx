import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import  React, { useState, useEffect } from 'react';
import { ColorSchemeName } from 'react-native';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import Authentication from './Authentication';
import LinkingConfiguration from './LinkingConfiguration';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useGlobalState } from '../state';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer 
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark'? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useGlobalState('user');

  useEffect(() => {
    const onAuthStateChanged = async (user: any) => {
      if(user && !user.role){
        try {
          const u = await firestore().collection('users').doc(user.uid).get();
          const d = await u.data();
          const r = {...d, email: user.email, uid: user.uid }
          user = r;
        } catch (err) {
          console.error(err);
        }
      }
      setUser(user);
      if (initializing) setInitializing(false);
    }
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}  >
      {!user?
      <Stack.Screen name="Authentication" component={Authentication} />:
      <Stack.Screen name="Root" component={BottomTabNavigator}  />}
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}

