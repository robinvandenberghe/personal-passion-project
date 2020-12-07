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
  const max = Math.ceil(user.points/100)*100;
  const percentage = (user.points/max)*100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mijn puntenstand</Text>
      <Text >Jouw huidige positie</Text>
      <View style={styles.scoreContainer}>
        <View style={styles.scoreWrapper}><View style={[styles.scoreBar, {width: `${percentage}%`}]}></View></View>
        <View style={styles.scoreLabels}><Text>0</Text><Text style={[styles.currentScore, percentage>50?{ right: `${100-percentage}%`}:{left: `${percentage}%`}]}>{user.points}</Text><Text>{max}</Text></View>
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
  scoreContainer:{
    width:'100%',
    marginVertical:16,
  },
  scoreWrapper:{
    backgroundColor: secondaryGrey,
    height:16,
    width:'100%',
  },
  scoreBar:{
    backgroundColor: primaryGrey,
    height:16,
  },
  scoreLabels:{
    flexShrink:1,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'flex-start',
    width:'100%',
    position:'relative',
  },
  currentScore:{
    position: 'absolute',
    top: 16,
    textAlign:'center',
    fontWeight:'600',
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