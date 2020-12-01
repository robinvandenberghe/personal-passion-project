import * as Linking from 'expo-linking';

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
              QRScreen: 'profiel/qr',
            },
          },        
        },
      },
      NotFound: '*',
    },
  },
};
