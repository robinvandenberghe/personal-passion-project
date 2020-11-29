import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { AuthenticationParamList } from '../types';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';


const AuthenticationStack = createStackNavigator<AuthenticationParamList>();

export default function Authentication() {
  return (
    <AuthenticationStack.Navigator >
      <AuthenticationStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false}}
      />
      <AuthenticationStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false}}
      />
    </AuthenticationStack.Navigator>
  );
}
