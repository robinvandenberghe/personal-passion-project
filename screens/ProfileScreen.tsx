import React, { useState } from 'react';
import { StyleSheet, Image, Pressable } from 'react-native';
import { Text, View, ScrollView} from '../components/Themed';
import Colors, { primaryCrema, secondaryGrey } from '../constants/Colors';
import AppIcons from '../components/AppIcons';
import useColorScheme from '../hooks/useColorScheme';
import { useLinkTo } from '@react-navigation/native';
import { useGlobalState } from '../state';

export default function ProfileScreen() {
  const [user, setUser] = useGlobalState('user');
  const [imgLink, setImgLink] = useState(!user.profileImg? require('../assets/images/defaultUser.jpg') : {uri: `http://192.168.1.35/assets/img/users/${user.profileImg}`});
  const colorScheme = useColorScheme();

  let welcomeMessage;
  const currentHour = new Date().getHours();
  if(currentHour>=6 && currentHour<=11){
    welcomeMessage = `Goeiemorgen, ${user.name}`;
  }else if(currentHour>11 && currentHour<18){
    welcomeMessage = `Goeiemiddag, ${user.name}`;
  }else if(currentHour>=18 && currentHour<=23){
    welcomeMessage = `Goeieavond, ${user.name}`;
  }else{
    welcomeMessage = `Goeienacht, ${user.name}`;
  }

  return (
    user.role && user.role=='admin'? 
    <ScrollView style={styles.container} >
      <Image source={imgLink} style={styles.profileImage}/>
      <Text style={styles.title}>{welcomeMessage}</Text>
      <View>
        <ProfileItem title={'QR-code'} route={'qr'} icon={'qr'} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Persoonlijke instellingen'} route={'instellingen'} icon={'settings'} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Mijn lidmaatschap'} route={'lidmaatschap'} icon={'membership'} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Puntenstand'} route={'puntenstand'} icon={'points'} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Mijn informatie'} route={'informatie'} icon={'info'} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Bestellingen'} route={'bestellingen'} icon={'orders'} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Nieuwe post'} route={'posts'} icon={'posts'} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Quizvragen'} route={'vragen'} icon={'questions'} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Evenementen'} route={'evenementen'} icon={'events'} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Beloningen'} route={'beloningen'} icon={'rewards'} color={Colors[colorScheme].text} />
      </View>
    </ScrollView>
  : 
    <View style={styles.container}>
      <Image source={imgLink} style={styles.profileImage}/>
      <Text style={styles.title}>{welcomeMessage}</Text>
      <View>
        <ProfileItem title={'QR-code'} route={'qr'} icon={'qr'} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Persoonlijke instellingen'} route={'instellingen'} icon={'settings'} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Mijn lidmaatschap'} route={'lidmaatschap'} icon={'membership'} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Puntenstand'} route={'puntenstand'} icon={'points'} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Mijn informatie'} route={'informatie'} icon={'info'} color={Colors[colorScheme].text} />
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding:16,
    width:'100%'
  },  
  separator: {
    marginVertical: 8,
    height: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical:16,
    textAlign:'center'
  },
  profileImage: {
    flexShrink: 1,
    height: 180,
    width: 180,
    maxWidth:'100%',
    resizeMode: 'cover',
    borderRadius: 90,
  },
  profileItem: {
    flexShrink:1,
    width:'90%',
    flexDirection:'row',
    alignItems:'center',
  },
  profileItemTitle:{
    fontWeight: '600',
    marginLeft:16,
    flexGrow:1,
  },
});

const ProfileItem = ({title, route, icon, color}:{title:string; route:string; icon:string; color:string;}) =>{
  const linkTo = useLinkTo();

  return(
    <Pressable onPress={()=> linkTo(`/profiel/${route}`)} style={styles.profileItem}>
      <AppIcons size={24} name={icon} color={color}  />
      <Text style={[{color}, styles.profileItemTitle]}>{title}</Text>
    </Pressable>
  );
}