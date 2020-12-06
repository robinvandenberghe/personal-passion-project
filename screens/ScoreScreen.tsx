import React, {useState, useEffect} from 'react';
import { StyleSheet, Image, Pressable } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Text, View, ScrollView} from '../components/Themed';
import Colors, { errorDark, primaryCrema, primaryDark, primaryGrey, secondaryGrey, secondaryLight } from '../constants/Colors';
import AppIcons from '../components/AppIcons';
import useColorScheme from '../hooks/useColorScheme';
import { useLinkTo } from '@react-navigation/native';
import { useGlobalState } from '../state';



export default function SettingsScreen() {
  const [user, setUser] = useGlobalState('user');
  const colorScheme = useColorScheme();
  const linkTo = useLinkTo();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mijn puntenstand</Text>
      <Text >Jouw huidige positie</Text>

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
  
});

const ProfileItem = ({title, action, icon, color}:{title:string; action:any; icon:string; color:string;}) =>{
  return(
    <Pressable onPress={action} style={styles.profileItem}>
      <AppIcons size={24} name={icon} color={color}  />
      <Text style={[{color}, styles.profileItemTitle]}>{title}</Text>
    </Pressable>
  );

}