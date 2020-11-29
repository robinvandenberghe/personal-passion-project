import React , { useState, useEffect } from 'react';
import { StyleSheet , FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import InputWithLabel from '../components/InputWithLabel';
import { Text, View, Button } from '../components/Themed';


export default function LoginScreen() {
  const [ email, setEmail] = useState("");
  const [ password, setPassword] = useState("");

  // useEffect(() => {
  //   async function fetchDrinks() {
  //     try {
  //       const ref = await firestore().collection('drinks').get();
  //       const arr = ref.docs;
  //       arr.map(item => item.data)
  //       setDrinks(arr);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }

  //   fetchDrinks();
  // }, [drinks]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <InputWithLabel placeholder="e-mailadres" label="e-mail" value={email} callback={setEmail} type="email" />
      <InputWithLabel placeholder="wachtwoord" label="wachtwoord" value={password} callback={setPassword} type="password" />
      <Button onPress={onPressLearnMore} title="Learn More" accessibilityLabel="Learn more about this purple button"/>
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

