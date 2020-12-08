import { useLinkTo } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { PrimaryButton, Text, View } from '../components/Themed';

export default function PlayScreen() {
  const linkTo = useLinkTo();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kies een spel</Text>
      <PrimaryButton style={styles.gameButton} onPress={()=>linkTo('/speel/pictionary')} label={`Pictionary`}/>
      {/* <PrimaryButton style={styles.gameButton} onPress={()=>linkTo('/speel/trivial-time')} label={`Trivial Time`} /> */}
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
    fontSize: 24,
    fontWeight: '600',
    marginBottom:16,
  }, 
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  gameButton:{
    marginVertical: 8,
    alignSelf: 'center',
  },
});
