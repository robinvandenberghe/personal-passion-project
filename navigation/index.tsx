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
import { primaryCrema, primaryDark } from '../constants/Colors';


// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer 
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(global.user);


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
      global.user = user;
      setUser(user);
      if (initializing) setInitializing(false);
    }
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [user]);

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

