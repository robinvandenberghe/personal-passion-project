import React , { useState } from 'react';
import { StyleSheet} from 'react-native';
import {  View, PrimaryButton , InputWithLabel, Text, Link} from '../components/Themed';
import auth from '@react-native-firebase/auth';

export default function LoginScreen() {
  const [ email, setEmail] = useState(``);
  const [ password, setPassword] = useState(``);
  const [error, setError] = useState<{type:string; subject:string; message:string;}>();

  const handleLogin = async () => {
    if(email && password){
      auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          setError({type: error.code, subject: `email`, message: `Het gebruikte e-mailadres is niet geldig.`});
        }
        if(error.code === 'auth/user-not-found'){
          setError({type: error.code, subject: `email`, message: `Er bestaat geen gebruiker met dit e-mailadres.`});
        }
        if(error.code === 'auth/wrong-password'){
          setError({type: error.code, subject: `password`, message: `Het opgegeven wachtwoord is niet correct.`});
        }
        if(error.code === 'auth/user-disabled'){
          setError({type: error.code, subject: `email`, message: `Het account met dit e-mailadres werd tijdelijk uitgeschakeld.`});
        }      
      });  
    }else{
      if(!email){
        setError({type: `noEmail`, subject: `email`, message: `Vul een emailadres in`});
      }
      if(!password){
        setError({type: `noPassword`, subject: `password`, message: `Vul een wachtwoord in.`});
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <InputWithLabel style={styles.input} placeholder="e-mailadres" label="e-mail" isError={(error && error.subject) == 'email'?true: false} value={email} callback={(val)=>{if(val!==''&&error&&error.subject=='email'){setError(null)}; setEmail(val);}} type="emailAddress" />
      <InputWithLabel style={styles.input} placeholder="wachtwoord" label="wachtwoord" isError={(error && error.subject) == 'password'?true: false} value={password} callback={(val)=>{if(val!==''&&error&&error.subject=='password'){setError(null)}; setPassword(val);}} type="password" />
      <PrimaryButton onPress={handleLogin} style={styles.button} label={'Inloggen'}/>
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
    alignSelf:'center',
  }
});

