import { useLinkTo } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Pressable, Text, View } from '../components/Themed';
import { dropShadow, primaryLight } from './../constants/Colors';

export default function PlayScreen() {
  const linkTo = useLinkTo();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kies een spel</Text>
      <Pressable style={styles.gameButton} onPress={()=>linkTo('/speel/pictionary')}>
        <Text style={[styles.gameTitle]}>{`Pictionary >`}</Text>
        <Image style={styles.coverImage} source={require('./../assets/images/PictionaryCover.jpg')} />
      </Pressable>
      <Pressable style={styles.gameButton} onPress={()=>linkTo('/speel/trivial-time')}>
        <Text style={[styles.gameTitle]}>{`Trivial Time >`}</Text>
        <Image style={styles.coverImage} source={require('./../assets/images/TrivialCover.jpg')} />
      </Pressable>
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
    borderRadius:8,
    width:'90%',
    height: 120,
    ...dropShadow
  },
  coverImage:{
    ...StyleSheet.absoluteFillObject,
    resizeMode: `cover`,
    width:'100%',
    height: '100%',
    overflow:'hidden',
    borderRadius:8,
  },
  gameTitle:{
    position: 'absolute',
    right:8,
    bottom:8,
    textAlign: "right",
    zIndex:3, 
    fontWeight: '600',
    fontSize:22,
    ...dropShadow,
    color: primaryLight,
  }
});
