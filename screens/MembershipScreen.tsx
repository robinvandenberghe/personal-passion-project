import React, {useState, useEffect} from 'react';
import { StyleSheet, Image, Pressable } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Text, View, PrimaryButton, Message} from '../components/Themed';
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
      <Text style={styles.title}>Mijn lidmaatschap</Text>
      <Message type={`success`} message={`Jouw lidmaatschap is in orde voor dit werkingsjaar`} />
      <View style={styles.membershipWrapper}>
        <View style={styles.membershipBox}>
          <Text>Lidnummer</Text>
          <Text style={styles.memberNumber}>{user.membership.memberNumber}</Text>
        </View>
        <Text style={styles.subtext}>Vernieuw volgend jaar je lidmaatschap om lid te blijven.</Text>
        <Text style={styles.perksText}>Chech hieronder jouw voordelen als lid van 't Kalf</Text>
        <PrimaryButton onPress={()=>{}} label={`Check je voordelen!`}/>
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
    width:'85%',
    height: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom:8,
    alignSelf:'flex-start'
  },
  membershipBox:{
    width:'100%',
    borderRadius: 16,
    padding: 8,
    borderWidth:4,
    borderColor: primaryGrey,
    flexShrink:1,
    alignItems:'center',
  },
  membershipWrapper:{
    width: '65%',
  },
  memberNumber:{
    fontSize:36,
    fontWeight:'600',
  },
  subtext:{
    fontSize:13,
    color: secondaryGrey,
    marginVertical:8,
    marginBottom:16,
  },
  perksText:{
    marginVertical:8,

  }
  
});
