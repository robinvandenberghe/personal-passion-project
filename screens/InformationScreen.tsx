import React , { useState, useEffect } from 'react';
import { StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {  View, Pressable , InputWithLabel, Text, Link} from '../components/Themed';
import { primaryCrema } from '../constants/Colors';

export default function LoginScreen() {
  const [ email, setEmail] = useState("");
  const [ password, setPassword] = useState("");
  const [ repeatPassword, setRepeatPassword] = useState("");
  const [ name, setName] = useState("");
  const [ surname, setSurname] = useState("");


  const handleRegister = async () => {
    if(email && password && repeatPassword && name && surname && password === repeatPassword){
      auth()
      .createUserWithEmailAndPassword(email, password)
      .then(({user}) => {
        firestore().collection('users').doc(user.uid).set({name, surname, role: 'user', profileImg: '', phoneNumber: '', points: 0, settings: {darkMode: false, pushNotifications: false}, membership: {date: undefined, memberNumber:null, paymentId: ''} });
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email is already in use!');
        }
        if (error.code === 'auth/weak-password') {
          console.log('That password is too weak!');
        }
        console.error(error);
      });  
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mijn informatie</Text>
      <View>

      </View>
      <InputWithLabel style={styles.input} placeholder="Jan" label="voornaam" value={name} callback={setName} type="name" />
      <InputWithLabel style={styles.input} placeholder="Janssens" label="familienaam" value={surname} callback={setSurname} type="familyName" />
      <InputWithLabel style={styles.input} placeholder="e-mailadres" label="e-mail" value={email} callback={setEmail} type="emailAddress" />
      <InputWithLabel style={styles.input} placeholder="wachtwoord" label="wachtwoord" value={password} callback={setPassword} type="password" />
      <InputWithLabel style={styles.input} placeholder="herhaal wachtwoord" label="herhaal wachtwoord" value={repeatPassword} callback={setRepeatPassword} type="password" />
      <Pressable onPress={handleRegister} ><Text style={styles.buttonText}>Registreren</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'flex-start',
    padding:16,
    width:'100%'
  },  
  separator: {
    marginVertical: 8,
    width:'85%',
    height: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom:8,
  },
  settings:{
    marginTop:24,
    flexShrink:1,
    alignItems:'center',
    width:"100%",
  },
  profileItem: {
    flexShrink:1,
    width:'95%',
    flexDirection:'row',
    alignItems:'center',
  },
  profileItemTitle:{
    fontWeight: '600',
    marginLeft:16,
    flexGrow:1,
  },
  buttonText: {
    fontSize: 16,
    color: primaryCrema,
    fontWeight: '600',
  }
  
});
