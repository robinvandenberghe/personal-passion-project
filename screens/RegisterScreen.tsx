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


  const handleRegister = async () => {
    if(email && password && repeatPassword && name && surname && password === repeatPassword){
      auth()
      .createUserWithEmailAndPassword(email, password)
      .then(({user}) => {
        firestore().collection('users').doc(user.uid).set({name, surname, role: 'user', profileImg: '', phoneNumber: '', points: 0, settings: { pushNotifications: false}, membership: {date: undefined, memberNumber:'', paymentId: ''} });
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
      <Text style={styles.title}>Registreren</Text>
      <InputWithLabel style={styles.input} placeholder="Jan" label="voornaam" value={name} callback={setName} type="name" />
      <InputWithLabel style={styles.input} placeholder="Janssens" label="familienaam" value={surname} callback={setSurname} type="familyName" />
      <InputWithLabel style={styles.input} placeholder="e-mailadres" label="e-mail" value={email} callback={setEmail} type="emailAddress" />
      <InputWithLabel style={styles.input} placeholder="wachtwoord" label="wachtwoord" value={password} callback={setPassword} type="password" />
      <InputWithLabel style={styles.input} placeholder="herhaal wachtwoord" label="herhaal wachtwoord" value={repeatPassword} callback={setRepeatPassword} type="password" />
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

