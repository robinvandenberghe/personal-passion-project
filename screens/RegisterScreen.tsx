import React , { useState, useEffect } from 'react';
import { StyleSheet} from 'react-native';
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
    alert(email);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registreren</Text>
      <InputWithLabel style={styles.input} placeholder="Jan" label="voornaam" value={name} callback={setName} type="name" />
      <InputWithLabel style={styles.input} placeholder="Janssens" label="familienaam" value={surname} callback={setSurname} type="familyName" />
      <InputWithLabel style={styles.input} placeholder="e-mailadres" label="e-mail" value={email} callback={setEmail} type="emailAddress" />
      <InputWithLabel style={styles.input} placeholder="wachtwoord" label="wachtwoord" value={password} callback={setPassword} type="password" />
      <InputWithLabel style={styles.input} placeholder="herhaal wachtwoord" label="herhaal wachtwoord" value={repeatPassword} callback={setRepeatPassword} type="password" />
      <Pressable onPress={handleRegister} style={styles.button}><Text style={styles.buttonText}>Registreren</Text></Pressable>
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
  },
  buttonText: {
    color: primaryCrema,
    fontSize:16,
    fontWeight: "600",
    fontFamily: 'Poppins',
  }
});

