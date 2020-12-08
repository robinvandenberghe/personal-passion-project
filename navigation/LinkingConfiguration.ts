import * as Linking from 'expo-linking';
import { ScreenStackHeaderRightView } from 'react-native-screens';

export default {

  config: {
    screens: { 
      Authentication: {
        screens: {
          Login: {
            screens: {
              LoginScreen: 'login',
            },
          },
          Register: {
            screens: {
              RegisterScreen: 'registreer',
            },
          }
        }
      },
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: 'home',
              EventScreen: {
                path: 'event/:title/:eventId',
                parse: {
                  title: (title) => `${title}`,
                  eventId: (eventId) => `${eventId}`,
                }
              },
            },
          },
          Speel: {
            screens: {
              PlayScreen: 'speel',
              PictionaryScreen: 'speel/pictionary',
              TrivialTimeScreen: 'speel/trivial-time',
            },
          },
          Bestel: {
            screens: {
              OrderScreen: 'bestel',
              CartScreen:'cart',
            },
          },          
          Profiel: {
            screens: {
              ProfileScreen: 'profiel',
              QRScreen: 'profiel/qr',
              SettingsScreen: 'profiel/instellingen',
              MembershipScreen: 'profiel/lidmaatschap',
              ScoreScreen: 'profiel/puntenstand',
              InformationScreen: 'profiel/informatie',
              OrdersScreen: 'profiel/bestellingen',
              PostsScreen: 'profiel/posts',
              QuestionsScreen: 'profiel/vragen',
              EventScreen:'profiel/evenementen',
              RewardsScreen: 'profiel/beloningen',
            },
          },        
        },
      },
      NotFound: '*',

    },
  },
};
