import React, { useState } from 'react';
import { StyleSheet, Pressable} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Text, View, Switch } from '../components/Themed';
import Colors, { errorDark, primaryCrema, secondaryGrey } from '../constants/Colors';
import AppIcons from '../components/AppIcons';
import useColorScheme from '../hooks/useColorScheme';
import { useGlobalState } from '../state';



export default function SettingsScreen() {
  const [user, setUser] = useGlobalState('user');
  const [pushNotifications, setPushNotifications] = useState<boolean>(user.settings.pushNotifications);
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
        <ProfileItem title={'Over de app'} action={()=>{}} icon={''} color={Colors[colorScheme].text} />
        <View style={styles.separator} lightColor={primaryCrema} darkColor={secondaryGrey} />
        <ProfileItem title={'Uitloggen'} action={()=> {
          setUser(undefined);
          auth().signOut();
         }} icon={'logout'} color={errorDark} />
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
  settingView:{
    flexGrow:1,
    justifyContent: 'space-between',
    flexDirection:'row',
    width:'95%',
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