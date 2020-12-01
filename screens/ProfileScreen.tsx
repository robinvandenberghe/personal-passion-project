import React, {useState, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Text, View, Pressable } from '../components/Themed';

export default function ProfileScreen() {
  const [user, setUser] = useState(global.user);

  let welcomeMessage;
  const currentHour = new Date().getHours();
  if(currentHour>=6 && currentHour<=11){
    welcomeMessage = `Goeiemorgen, ${user.name}`;
  }else if(currentHour>11 && currentHour<18){
    welcomeMessage = `Goeiemiddag, ${user.name}`;
  }else if(currentHour>=18 && currentHour<=23){
    welcomeMessage = `Goeieavond, ${user.name}`;
  }else{
    welcomeMessage = `Goeienacht, ${user.name}`;
  }

  useEffect(() => {
    const fetchUserInfo = async (user:any) => {
      if(!user.role){
        try {
          const u = await firestore().collection('users').doc(user.uid).get();
          const d = await u.data();
          const r = {...d, email: user.email, uid: user.uid }
          setUser(r);
          if(user.role){
            // const url = await storage().ref(`users/${r.uid}/${r.profileImg}`).getDownloadURL();
            // const r.profileImg = url;
            // setUser(r);
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchUserInfo(user);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{welcomeMessage}</Text>
      <Pressable onPress={()=>auth().signOut()} ><Text>Uitloggen</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
