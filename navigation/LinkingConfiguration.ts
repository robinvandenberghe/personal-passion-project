import * as Linking from 'expo-linking';

export default {
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: 'home',
            },
          },
          Speel: {
            screens: {
              PlayScreen: 'speel',
            },
          },
          Bestel: {
            screens: {
              OrderScreen: 'bestel',
            },
          },          
          Profiel: {
            screens: {
              ProfileScreen: 'profiel',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
