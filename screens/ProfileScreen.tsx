import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Pressable, Button, Dimensions, Platform } from 'react-native';
import { Text, View, ScrollView, Message } from '../components/Themed';
import Colors, { primaryCrema, secondaryGrey } from '../constants/Colors';
import AppIcons from '../components/AppIcons';
import useColorScheme from '../hooks/useColorScheme';
import { useLinkTo } from '@react-navigation/native';
import { useGlobalState } from '../state';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';

export default function ProfileScreen() {
  const [user, setUser] = useGlobalState('user');
  const [imgLink, setImgLink] = useState(!user.profileImg? require('../assets/images/defaultUser.jpg') : {uri: `http://192.168.1.35/assets/img/users/${user.profileImg}`});
  const [ tempImage , setTempImage ] = useState<ImageOrVideo>();
  const [ info, setInfo ] = useState<{ type:string; subject:string; message:string; }|null>();
  const colorScheme = useColorScheme();

  if(info){
    setTimeout(()=>setInfo(null), 4500);
  }

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

  const handleChoosePhoto = async () => {
    const image = await ImagePicker.openPicker({
      compressImageMaxWidth: 750,
      compressImageMaxHeight: 750,
      compressImageQuality:0.75,
      forceJpg: true,
    });
    if(image){
      handleUploadPhoto(image).then(response => {
        if(response){
          firestore().doc(`users/${user.uid}`).update({profileImg: response.image.filename});
          user.profileImg = response.image.filename;          
          setUser(user);
          setImgLink({uri: `http://192.168.1.35/assets/img/users/${response.image.filename}`});
          setInfo({type: `success`, subject: `profileImage`, message:`Profielfoto succesvol upgeload!`});
        }else{
          setInfo({type: `error`, subject: `profileImage`, message:`Er liep iets mis tijdens het uploaden van je profielfoto.`});
        }
      });

    } 
  }

  const handleUploadPhoto = (image) => {
    return fetch("http://192.168.1.35/api/user-profilepicture", {
      method: "POST",
      body: createFormData(image, { userId: user.uid, profileLink: user.profileImg })
    })
      .then(response => response.json())
      .catch(error => {
        console.log("upload error", error);
      });
  };

  const createFormData = (photo, body) => {
    const data = new FormData();
    data.append(`photo`, {
      name: photo.filename,
      type: photo.type,
      uri:
        Platform.OS === "android" ? photo.sourceURL : photo.sourceURL.replace("file://", "")
    });
 
    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
  
    return data;
  };

  return (
    user.role && user.role=='admin'? 
    <ScrollView style={styles.container} >
      <View style={styles.profileImageWrapper}>
        <Pressable onPress={handleChoosePhoto} style={[styles.editProfileImageButton, {backgroundColor: Colors[colorScheme].text}]}>
          <AppIcons size={20} color={Colors[colorScheme].background} name={`posts`} />
        </Pressable>
        <Image source={imgLink} style={styles.profileImage}/>
      </View>
      {info && info.subject===`profileImage`? <Message type={info.type} message={info.message} /> : null}
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
  profileImageWrapper:{
    borderRadius: 90,
    height: 180,
    width: 180,
    maxWidth:'100%',
    flexShrink: 1,
    overflow:'hidden',
    position:'relative',
  },
  profileImage: {
    width:'100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editProfileImageButton:{
    position:'absolute',
    bottom:0,
    width: '100%',
    alignItems: 'center',
    justifyContent:'center',
    height:32,
    zIndex:3,
    opacity:.8,
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