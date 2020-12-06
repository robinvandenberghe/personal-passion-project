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
      <Text style={styles.title}>Mijn instellingen</Text>
      <Text >Wijzig hier jouw persoonlijke instellingen</Text>
      <View style={styles.settings}>
        <ProfileItem title={'QR-code'} route={'qr'} icon={'qr'} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Persoonlijke instellingen'} route={''} icon={'settings'} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Mijn lidmaatschap'} route={''} icon={'membership'} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Over de app'} action={()=>{}} icon={''} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Uitloggen'} action={()=> {
          global.user = undefined;
          setUser(undefined);
          auth().signOut();
         } } icon={'logout'} color={errorDark} />
      </View>
      {/* <Pressable onPress={()=>auth().signOut()} ><Text>Uitloggen</Text></Pressable> */}
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