import React , { useState, useEffect } from 'react';
import { StyleSheet} from 'react-native';
import {  View, Pressable , InputWithLabel, Text, Link} from '../components/Themed';
import { primaryCrema } from '../constants/Colors';
import auth from '@react-native-firebase/auth';


export default function LoginScreen() {
  const [ email, setEmail] = useState("");
  const [ password, setPassword] = useState("");

  const handleLogin = async () => {
    if(email && password){
      auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        console.error(error);
      });  
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <InputWithLabel style={styles.input} placeholder="e-mailadres" label="e-mail" value={email} callback={setEmail} type="emailAddress" />
      <InputWithLabel style={styles.input} placeholder="wachtwoord" label="wachtwoord" value={password} callback={setPassword} type="password" />
      <Pressable onPress={handleLogin} style={styles.button}><Text style={styles.buttonText}>Inloggen</Text></Pressable>
      <Link to="/registreer">Nog geen account? Registreer hier.</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink:1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
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
  input: {
    marginVertical: 4,
  },
  button: {
    marginVertical: 12,
  },
  buttonText: {
    color: primaryCrema,
    fontSize:16,
    fontWeight: "600",
    fontFamily: 'Poppins',
  }
});

