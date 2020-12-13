import React, { useState } from 'react';
import { StyleSheet, Pressable, Linking } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Text, View, Switch, SecondaryButton } from '../components/Themed';
import Colors, { errorDark, primaryCrema, secondaryGrey, dropShadow } from '../constants/Colors';
import AppIcons from '../components/AppIcons';
import useColorScheme from '../hooks/useColorScheme';
import { useGlobalState } from '../state';
import Modal from 'react-native-modal';

export default function SettingsScreen() {
  const [user, setUser] = useGlobalState('user');
  const [ pushNotifications, setPushNotifications ] = useState<boolean>(user.settings.pushNotifications);
  const [ isModalVisible, setModalVisible ] = useState<boolean>(false);
  const colorScheme = useColorScheme();

  if( pushNotifications !== user.settings.pushNotifications){
    user.settings = { pushNotifications};
    setUser(user);
    firestore().collection('users').doc(user.uid).update({settings: { pushNotifications}}).catch(error=>console.error(error));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mijn instellingen</Text>
      <Text >Wijzig hier jouw persoonlijke instellingen</Text>
      <View style={styles.settings}>
        <View style={styles.settingView}><Text>Push-meldingen</Text><Switch value={pushNotifications} onValueChange={(value)=>setPushNotifications(value)}/></View>
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Over de app'} action={()=>setModalVisible(true)} icon={''} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Uitloggen'} action={()=> {
          auth().signOut();
          setUser(undefined);
         }} icon={'logout'} color={errorDark} />
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modal}>
          <Text style={styles.aboutTitle}>Over de app</Text>
          <Text style={{marginVertical:8,fontSize:14}}>Deze app is ontwikkeld als eindopdracht tijdens de studies van Robin Vanden Berghe integraal voor JH 't Kalf.</Text>
          <Text style={{marginVertical:8,fontSize:14}}>Ontdek meer over deze app en de andere projecten van Robin via onderstaande link.</Text>
          <Pressable style={styles.personalButton} onPress={()=>Linking.openURL(`https://www.robinvandenb.be/`)} ><Text style={styles.buyButton}>Ontdek portfolio</Text></Pressable>
          <Text style={{marginVertical:8,fontSize:14}}>Indien je fan bent van de app en graag een kleine bijdrage wil schenken, dan kan je Robin een koffie schenken via onderstaande knop.</Text>
          <Pressable style={styles.personalButton} onPress={()=>Linking.openURL(`https://www.buymeacoffee.com/robinvandenb`)} ><Text style={styles.buyButton}>{`☕  Buy me a coffee`}</Text></Pressable>
          <SecondaryButton style={{alignSelf:'flex-end', marginTop:8,}} onPress={()=>setModalVisible(false)} label={`Terug`}/>
        </View>
      </Modal>
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
  settingView:{
    flexGrow:1,
    justifyContent: 'space-between',
    flexDirection:'row',
    width:'95%',
  },
  modal:{
    bottom:0,
    borderRadius:8,
    padding:16,
    flexShrink:1,
  },
  aboutTitle:{
    fontSize:18,
    fontWeight:'500',
  },
  personalButton:{
    backgroundColor: `#2E8787`,
    borderRadius:8,
    flexShrink:1,
    alignSelf:'center',
    paddingVertical:4,
    paddingHorizontal:8,
    marginVertical:8,
    ...dropShadow
  },
  buyButton:{
    color: `#fff`,
    fontWeight: '600',
    fontSize: 20,
  }
});

const ProfileItem = ({title, action, icon, color}:{title:string; action:any; icon:string; color:string;}) =>{
  return(
    <Pressable onPress={action} style={styles.profileItem}>
      <AppIcons size={24} name={icon} color={color}  />
      <Text style={[{color}, styles.profileItemTitle]}>{title}</Text>
    </Pressable>
  );

}