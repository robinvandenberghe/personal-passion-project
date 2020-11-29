import React , { useState, useEffect } from 'react';
import { StyleSheet} from 'react-native';
import {  View, Pressable , InputWithLabel, Text, Link} from '../components/Themed';
import { primaryCrema } from '../constants/Colors';

export default function LoginScreen() {
  const [ email, setEmail] = useState("");
  const [ password, setPassword] = useState("");

  const handleLogin = async () => {
    alert(email);
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

