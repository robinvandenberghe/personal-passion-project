import React, {useState, useEffect} from 'react';
import { StyleSheet, Image, Pressable } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Text, View, ScrollView, PrimaryButton, SecondaryButton, } from '../components/Themed';
import Colors, { errorDark, primaryCrema, primaryDark, primaryGrey, secondaryGrey, secondaryLight, successDark, dropShadow } from '../constants/Colors';
import AppIcons from '../components/AppIcons';
import useColorScheme from '../hooks/useColorScheme';
import { useLinkTo } from '@react-navigation/native';
import { useGlobalState } from '../state';
import Modal from 'react-native-modal';

export default function SettingsScreen() {
  const [user, setUser] = useGlobalState('user');
  const [ isModalVisible, setModalVisible ] = useState<boolean>(true);
  const colorScheme = useColorScheme();
  const linkTo = useLinkTo();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mijn lidmaatschap</Text>
      {user.membership.date? 
        <>
          <View style={styles.successMessage}>
            <AppIcons size={18} color={successDark} name={`success`}/>
            <Text style={styles.successMessageText}>Jouw lidmaatschap is in orde voor dit werkingsjaar</Text>
          </View>
          <View style={styles.membershipWrapper}>
            <View style={styles.membershipBox}>
              <Text>Lidnummer</Text>
              <Text style={styles.memberNumber}>{user.membership.memberNumber}</Text>
            </View>
            <Text style={styles.subtext}>Vernieuw volgend jaar je lidmaatschap om lid te blijven.</Text>
            <Text style={styles.perksText}>Check hieronder jouw voordelen als lid van 't Kalf</Text>
            <PrimaryButton onPress={()=>setModalVisible(true)} label={`Check je voordelen!`}/>
          </View>
        </> : null}
      <Modal 
       style={{overflow:'hidden', top:'10%', maxHeight:'80%', borderRadius:8}} isVisible={isModalVisible}>
        <ScrollView bounces={true} style={styles.modal}>
          <Text style={styles.aboutTitle}>Voordelen als lid</Text>
          <Text style={{marginVertical:8}}>Als lid van ‘t Kalf heb je recht op tal van voordelen. </Text>
          <Image style={styles.perkImages} source={require('./../assets/images/cava.png')}/>
          <Text style={{marginTop:8,fontWeight:'500'}}>Een fles cava op je verjaardag</Text>
          <Text style={{fontSize:14}}>Iedereen viert graag, en daarom viert ‘t Kalf graag met jou mee. Op je verjaardag krijg je van ons een gratis fles cava.</Text>
          <Text style={{marginVertical:8,fontSize:10}}>Op vertoon van je identiteitskaart heb je vanaf je verjaardag tot 14 dagen nadien recht op één fles cava.</Text>
          <Image style={styles.perkImages} source={require('./../assets/images/bus.png')}/>
          <Text style={{marginTop:8,fontWeight:'500'}}>Een fles cava op je verjaardag</Text>
          <Text style={{fontSize:14}}>Iedereen viert graag, en daarom viert ‘t Kalf graag met jou mee. Op je verjaardag krijg je van ons een gratis fles cava.</Text>
          <Text style={{marginVertical:8,fontSize:10}}>Op vertoon van je identiteitskaart heb je vanaf je verjaardag tot 14 dagen nadien recht op één fles cava.</Text>
          <Image style={styles.perkImages} source={require('./../assets/images/cava.png')}/>
          <Text style={{marginTop:8,fontWeight:'500'}}>Een fles cava op je verjaardag</Text>
          <Text style={{fontSize:14}}>Iedereen viert graag, en daarom viert ‘t Kalf graag met jou mee. Op je verjaardag krijg je van ons een gratis fles cava.</Text>
          <Text style={{marginVertical:8,fontSize:10}}>Op vertoon van je identiteitskaart heb je vanaf je verjaardag tot 14 dagen nadien recht op één fles cava.</Text> 
          <SecondaryButton style={{alignSelf:'flex-end', marginTop:8,}} onPress={()=>setModalVisible(false)} label={`Terug`}/>
        </ScrollView>
      </Modal>
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

  },
  successMessage:{
    flexDirection: 'row',
    width:'85%',
    alignItems:'center',
    marginVertical:16,
  },
  successMessageText:{
    color: successDark,
    flexGrow:1,
    marginLeft:8,
  },
  modal:{
    bottom:0,
    borderRadius:8,
    padding:16,
    flexGrow:1,
  },
  aboutTitle:{
    fontSize:18,
    fontWeight:'500',
  },
  perkImages:{
    width:'100%',
    height:150,
    resizeMode:'contain',
    marginVertical:8,
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
