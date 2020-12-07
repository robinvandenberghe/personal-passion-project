import {KeyboardType} from 'react-native';

export type RootStackParamList = {
  Raspberry:undefined;
  Root: undefined;
  Authentication: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Speel: undefined;
  Bestel: undefined;
  Profiel: undefined;
};

export type AuthenticationParamList = {
  Login: undefined;
  Register: undefined;
};

export type HomeParamList = {
  HomeScreen: undefined;
  EventScreen: {evenId:string};

};

export type PlayParamList = {
  PlayScreen: undefined;
};
export type OrderParamList = {
  OrderScreen: undefined;
  CartScreen:undefined;
};
export type ProfileParamList = {
  ProfileScreen: undefined;
  QRScreen: undefined;
  SettingsScreen: undefined;
  MembershipScreen: undefined;
  ScoreScreen: undefined;
  InformationScreen: undefined;
  OrdersScreen: undefined;
  PostsScreen: undefined;
  QuestionsScreen: undefined;
  EventsScreen: undefined;
  RewardsScreen:undefined;
};

export interface cartType {
  amount:number;
  drink: drinksType;
}

export interface drinksType {
  uid:string;
  category:string;
  imageUrl:string;
  price:number;
  title:string;
}

export type userType = { 
  email:string;
  uid:string;
  membership: {
    date: any; 
    memberNumber: string; 
    paymentId: string;
  }; 
  name:string; 
  surname:string;
  phoneNumber:string; 
  points:number; 
  profileImg: string; 
  role:string; 
  settings: {
    pushNotifications:boolean
  }; 
}

export type inputErrorType = {
  subject:string;
  message:string;
}

export type textInputType = {
  isError?:boolean;
  errMessage?:string;
  placeholder?: string;
  label?:string;
  disabled?:boolean;
  value:string;
  callback:any;
  type?:any;
  style?:any;
  keyboardType?:KeyboardType;
}

export type orderType = {
  uid:string;
  date:any;
  drinks: object;
  paid:boolean;
  ready:boolean;
  tableNumber:string;
  userId:string;
}