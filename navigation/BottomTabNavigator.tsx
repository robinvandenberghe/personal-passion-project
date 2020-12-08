import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import React, {useState} from 'react';
import AppIcons from '../components/AppIcons';
import Colors, { infoDark, primaryDark } from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import HomeScreen from '../screens/HomeScreen';
import PlayScreen from '../screens/PlayScreen';
import OrderScreen from '../screens/OrderScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { BottomTabParamList, HomeParamList, PlayParamList, OrderParamList, ProfileParamList, cartType} from '../types';
import { StyleSheet, Button } from 'react-native';
import EventScreen from '../screens/EventScreen';
import QRScreen from '../screens/QRScreen';
import CartScreen from '../screens/CartScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MembershipScreen from '../screens/MembershipScreen';
import ScoreScreen from '../screens/ScoreScreen';
import InformationScreen from '../screens/InformationScreen';
import { useGlobalState } from '../state';
import OrdersScreen from '../screens/OrdersScreen';
import QuestionsScreen from '../screens/QuestionsScreen';
import EventsScreen from '../screens/EventsScreen';
import RewardsScreen from '../screens/RewardsScreen';
import PostsScreen from '../screens/PostsScreen';
import PictionaryScreen from '../screens/PictionaryScreen';
import TrivialTimeScreen from '../screens/TrivialTimeScreen';



const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const [cart, setCart] = useGlobalState('cart');


  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      
      tabBarOptions={{ inactiveBackgroundColor: Colors[colorScheme].tabBackground, activeBackgroundColor: Colors[colorScheme].tabSelected, activeTintColor: Colors[colorScheme].tabIconSelected, inactiveTintColor: Colors[colorScheme].tabIconDefault, style:{backgroundColor: Colors[colorScheme].tabBackground}}}>
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
        }}/>
      <BottomTab.Screen
        name="Bestel"
        component={OrderNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="order" color={color} />,
          tabBarBadgeStyle: {backgroundColor: infoDark, flex:1,alignItems:'center', justifyContent:'center', padding: 1, fontWeight:'500'},
          tabBarBadge: (cart && cart.length >0 ? cart.length : undefined),
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
  const colorScheme = useColorScheme();

  return (
    <HomeStack.Navigator screenOptions={{headerTintColor: Colors[colorScheme].headerText, headerStyle: { backgroundColor: Colors[colorScheme].header}, headerBackTitleStyle:{color: Colors[colorScheme].headerText} }}>
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
  const colorScheme = useColorScheme();

  return (
    <PlayStack.Navigator screenOptions={{headerTintColor: Colors[colorScheme].headerText, headerStyle: { backgroundColor: Colors[colorScheme].header}, headerBackTitleStyle:{color: Colors[colorScheme].headerText} }}>
      <PlayStack.Screen
        name="PlayScreen"
        component={PlayScreen}
        options={{ headerTitle: 'Speel' }}
      />
      <PlayStack.Screen
        name="PictionaryScreen"
        component={PictionaryScreen}
        options={{ headerTitle: 'Pictionary',}}
      />
      <PlayStack.Screen
        name="TrivialTimeScreen"
        component={TrivialTimeScreen}
        options={{ headerTitle: 'Speel' }}
      />
    </PlayStack.Navigator>
  );
}
const OrderStack = createStackNavigator<OrderParamList>();

function OrderNavigator() {
  const colorScheme = useColorScheme();
  const [cart, setCart] = useGlobalState('cart');

  return (
    <OrderStack.Navigator screenOptions={{headerTintColor: Colors[colorScheme].headerText, headerStyle: { backgroundColor: Colors[colorScheme].header}, headerBackTitleStyle:{color: Colors[colorScheme].headerText} }}>
      <OrderStack.Screen
        name="OrderScreen"
        component={OrderScreen}
        options={{ headerTitle: 'Bestel' }}
        
      />
      <OrderStack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{ headerTitle: 'Bestelling' }}
        

      />
    </OrderStack.Navigator>
  );
}
const ProfileStack = createStackNavigator<ProfileParamList>();

const ProfileNavigator = () => {
  const colorScheme = useColorScheme();
  const [user, setUser] = useGlobalState('user');

  return (
    <ProfileStack.Navigator 
     screenOptions={{headerTintColor: Colors[colorScheme].headerText, headerStyle: { backgroundColor: Colors[colorScheme].header}, headerBackTitleStyle:{color: Colors[colorScheme].headerText} }}>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerTitle: 'Profiel' }}
      />
      <ProfileStack.Screen
        name="QRScreen"
        component={QRScreen}
        options={{ headerTitle: 'QR-code' }}
      />
      <ProfileStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerTitle: 'Instellingen' }}
      />
      <ProfileStack.Screen
        name="MembershipScreen"
        component={MembershipScreen}
        options={{ headerTitle: 'Lidmaatschap' }}
      />
      <ProfileStack.Screen
        name="ScoreScreen"
        component={ScoreScreen}
        options={{ headerTitle: 'Puntenstand' }}
      />
      <ProfileStack.Screen
        name="InformationScreen"
        component={InformationScreen}
        options={{ headerTitle: 'Mijn informatie' }}
      />
      {user.role === 'admin'?
      <>
        <ProfileStack.Screen
        name="OrdersScreen"
        component={OrdersScreen}
        options={{ headerTitle: 'Bestellingen' }}
        />
        <ProfileStack.Screen
        name="PostsScreen"
        component={PostsScreen}
        options={{ headerTitle: 'Posts' }}
        />
        <ProfileStack.Screen
        name="QuestionsScreen"
        component={QuestionsScreen}
        options={{ headerTitle: 'Quizvragen' }}
        />
        <ProfileStack.Screen
        name="EventsScreen"
        component={EventsScreen}
        options={{ headerTitle: 'Quizvragen' }}
        />
        <ProfileStack.Screen
        name="RewardsScreen"
        component={RewardsScreen}
        options={{ headerTitle: 'Quizvragen' }}
        />
      </>
      : null}
    </ProfileStack.Navigator>
  );
}
