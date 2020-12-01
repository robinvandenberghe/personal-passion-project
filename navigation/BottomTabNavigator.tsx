import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import AppIcons from '../components/AppIcons';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import HomeScreen from '../screens/HomeScreen';
import PlayScreen from '../screens/PlayScreen';
import OrderScreen from '../screens/OrderScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { BottomTabParamList, HomeParamList, PlayParamList, OrderParamList, ProfileParamList } from '../types';
import { StyleSheet, Button } from 'react-native';
import EventScreen from '../screens/EventScreen';
import { color } from 'react-native-reanimated';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ inactiveBackgroundColor: Colors[colorScheme].tabBackground, activeBackgroundColor: Colors[colorScheme].tabSelected, activeTintColor: Colors[colorScheme].tabIconDefault, tabStyle:{ flexShrink:1, alignContent:'center', alignItems:'center', justifyContent:'center', alignSelf:'center'}}}
      >
        
      <BottomTab.Screen
        name="Home"
        component={HomeNavigator}
        
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Speel"
        component={PlayNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="puzzle" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Bestel"
        component={OrderNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="order" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Profiel"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="profile" color={color} />,
        }}
      />

    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <AppIcons size={24} {...props}  />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const HomeStack = createStackNavigator<HomeParamList>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerTitle: 'Home'  }}
      />
      <HomeStack.Screen
        name="EventScreen"
        component={EventScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </HomeStack.Navigator>
  );
}

const PlayStack = createStackNavigator<PlayParamList>();

function PlayNavigator() {
  return (
    <PlayStack.Navigator>
      <PlayStack.Screen
        name="PlayScreen"
        component={PlayScreen}
        options={{ headerTitle: 'Speel' }}
      />
    </PlayStack.Navigator>
  );
}
const OrderStack = createStackNavigator<OrderParamList>();

function OrderNavigator() {
  return (
    <OrderStack.Navigator>
      <OrderStack.Screen
        name="OrderScreen"
        component={OrderScreen}
        options={{ headerTitle: 'Bestel' }}
      />
    </OrderStack.Navigator>
  );
}
const ProfileStack = createStackNavigator<ProfileParamList>();

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerTitle: 'Profiel' }}
      />
    </ProfileStack.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    padding: 8
  }
});