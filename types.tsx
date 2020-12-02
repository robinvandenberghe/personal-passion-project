export type RootStackParamList = {
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

};

