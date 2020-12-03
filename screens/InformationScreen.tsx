import React , { useState, useEffect } from 'react';
import { StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {  View, Pressable , InputWithLabel, Text, Link, PrimaryButton} from '../components/Themed';
import { primaryCrema } from '../constants/Colors';

export default function LoginScreen() {
  const [ email, setEmail] = useState(global.user.email);
  const [ currentPassword, setCurrentPassword] = useState('');
  const [ password, setPassword] = useState('');
  const [ repeatPassword, setRepeatPassword] = useState('');
  const [ name, setName] = useState(global.user.name);
  const [ surname, setSurname] = useState(global.user.surname);
  const [ phoneNumber, setPhoneNumber] = useState(global.user.phoneNumber);



  const handleInfoChange = () => {
    if(name && surname && phoneNumber){
      firestore().collection('users').doc(global.user.uid).update({name, surname, phoneNumber})
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

  const handlePasswordChange = () => {
    if(name && surname && phoneNumber){
      firestore().collection('users').doc(global.user.uid).update({name, surname, phoneNumber})
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
      <View style={styles.formContainer}>
        <Text style={styles.subText}>Persoonlijke gegevens</Text>
        <InputWithLabel style={styles.input} placeholder="Jan" label="voornaam" value={name} callback={setName} type="name" />
        <InputWithLabel style={styles.input} placeholder="Janssens" label="familienaam" value={surname} callback={setSurname} type="familyName" />
        <InputWithLabel style={styles.input} placeholder="e-mailadres" label="e-mail" value={email} callback={setEmail} disabled={true} type="emailAddress" />
        <InputWithLabel style={styles.input} placeholder="telefoonnummer" label="gsm-nummer (optioneel)" value={phoneNumber} callback={setPhoneNumber} type="telephoneNumber" />
        <PrimaryButton style={styles.button} onPress={handleInfoChange} label={'Opslaan'}/>

      </View>
      <View style={styles.formContainer}>
        <Text style={styles.subText}>Wachtwoord wijzigen</Text>
        <InputWithLabel style={styles.input} placeholder="wachtwoord" label="huidig wachtwoord" value={currentPassword} callback={setCurrentPassword} type="password" />
        <InputWithLabel style={styles.input} placeholder="nieuw wachtwoord" label="nieuw wachtwoord" value={password} callback={setPassword} type="password" />
        <InputWithLabel style={styles.input} placeholder="herhaal nieuw wachtwoord" label="herhaal nieuw wachtwoord" value={repeatPassword} callback={setRepeatPassword} type="password" />
        <PrimaryButton style={styles.button} onPress={handlePasswordChange} label={'Wijzigen'}/>
      </View>
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
  formContainer:{
    flexShrink:1,
    width:'90%',
    alignSelf:'center',
    alignItems:'center',
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
  input: {
    marginVertical: 4,
  },
  button:{
    alignSelf: 'flex-end',
    marginVertical:4,
    marginRight:'5%',
  },
  subText:{
    fontSize:14,
    fontWeight:'600',
    alignSelf:'flex-start',
  },
});
