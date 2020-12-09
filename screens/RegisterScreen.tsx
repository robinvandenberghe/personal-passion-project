import React , { useState} from 'react';
import { StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {  View , InputWithLabel, Text, Link, PrimaryButton} from '../components/Themed';

export default function LoginScreen() {
  const [ email, setEmail] = useState("");
  const [ password, setPassword] = useState("");
  const [ repeatPassword, setRepeatPassword] = useState("");
  const [ name, setName] = useState("");
  const [ surname, setSurname] = useState("");
  const [error, setError] = useState<{type:string; subject:string; message:string;}>();

  const handleRegister = async () => {
    if(email && password && repeatPassword && name && surname && password === repeatPassword){
      auth()
      .createUserWithEmailAndPassword(email, password)
      .then(({user}) => {
        firestore().collection('users').doc(user.uid).set({name, surname, role: 'user', profileImg: '', phoneNumber: '', points: 0, settings: { pushNotifications: false}, membership: {date: undefined, memberNumber:'', paymentId: ''} });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          setError({type: error.code, subject: `email`, message: `Er bestaat reeds een account met dit e-mailadres.`});
        }
        if (error.code === 'auth/weak-password') {
          setError({type: error.code, subject: `password`, message: `Het gebruikte wachtwoord is te zwak. Het moet op z'n minst 6 karakters bevatten waarvan minstens één cijfers en letter.`});
        }
        if (error.code === 'auth/invalid-email') {
          setError({type: error.code, subject: `email`, message: `Het gebruikte e-mailadres is niet geldig.`});
        }
        if (error.code === 'auth/operation-not-allowed') {
          setError({type: error.code, subject: `email`, message: `Het aanmelden met e-mailadres is momenteel niet mogelijk.`});
        }
      });  
    }else{
      if(!name){
        setError({type: `noName`, subject: `name`, message: `Vul uw naam in.`});
      }
      if(!surname){
        setError({type: `noSurname`, subject: `surname`, message: `Vul uw familienaam in.`});
      }
      if(!email){
        setError({type: `noEmail`, subject: `email`, message: `Vul een emailadres in`});
      }
      if(!password){
        setError({type: `noPassword`, subject: `password`, message: `Vul een wachtwoord in.`});
      }
      if(!repeatPassword){
        setError({type: `noRepeatPassword`, subject: `repeatPassword`, message: `Vul uw wachtwoord opnieuw in.`});
      }
      if(password!==repeatPassword){
        setError({type: `noMathingPasswords`, subject: `repeatPassword`, message: `De opgegeven wachtwoorden komen niet overeen.`});
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registreren</Text>
      <InputWithLabel style={styles.input} placeholder="Jan" label="voornaam" isError={(error && error.subject) == 'name'?true: false} value={name} callback={(val)=>{if(val!==''&&error&&error.subject=='name'){setError(null)}; setName(val);}} type="name" />
      <InputWithLabel style={styles.input} placeholder="Janssens" label="familienaam" isError={(error && error.subject) == 'surname'?true: false} value={surname} callback={(val)=>{if(val!==''&&error&&error.subject=='surname'){setError(null)}; setSurname(val);}} type="familyName" />
      <InputWithLabel style={styles.input} placeholder="e-mailadres" label="e-mail" isError={(error && error.subject) == 'email'?true: false} value={email} callback={(val)=>{if(val!==''&&error&&error.subject=='email'){setError(null)}; setEmail(val);}} type="emailAddress" />
      <InputWithLabel style={styles.input} placeholder="wachtwoord" label="wachtwoord" isError={(error && error.subject) == 'password'?true: false} value={password} callback={(val)=>{if(val!==''&&error&&error.subject=='password'){setError(null)}; setPassword(val);}} type="password" />
      <InputWithLabel style={styles.input} placeholder="herhaal wachtwoord" label="herhaal wachtwoord" isError={(error && error.subject) == 'repeatPassword'?true: false} value={repeatPassword} callback={(val)=>{if(val!==''&&error&&error.subject=='repeatPassword'){setError(null)}; setRepeatPassword(val);}} type="password" />
      <PrimaryButton onPress={handleRegister} style={styles.button} label={'Registreren'}/>
      <Link to="/login">Had je al een account? Log hier in.</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    alignSelf: 'center',
  }
});

