import React , { useState, useEffect } from 'react';
import { StyleSheet, Image} from 'react-native';
import {  View, Pressable , InputWithLabel, Text, Link} from '../components/Themed';
import { primaryDark, primaryCrema, secondaryLight } from '../constants/Colors';
import firestore from '@react-native-firebase/firestore';

export default function EventScreen({route, navigation}: {route?:any; navigation:any;}) {
  const { title, eventId} = route.params;
  const [ event, setEvent] = useState({imageUrl:'', titel:'', date: new Date(), description: ''});
  const [imgLink, setImgLink] = useState(require('./../assets/images/eventDefault.jpg'))


  useEffect(() => {
    async function fetchEvent() {
      try {
        const d =  await firestore().collection('events').doc(eventId).get();
        const da = d.data();
        da.date = da.date.toDate();
        da.id = d.id;
        da.imageUrl = null;
        setEvent(da);
        if(event){
          // const url = await storage().ref(`events/${event.imageUrl}`).getDownloadURL();
          // setImgLink(url);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchEvent();
  }, []);

  return (<View style={styles.container}>
    <Image source={imgLink} style={styles.eventImage}/>
    <View style={styles.eventInfo}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateNumber}>{event.date.toLocaleDateString('nl-BE', {day: '2-digit'})}</Text>
        <Text style={styles.dateMonth}>{event.date.toLocaleDateString('nl-BE', {month:'short'}).slice(0, -1)}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.eventTitle}>{event.titel}</Text>
      </View>

    </View>
    <View style={styles.moreInfo}>
        <Text >{event.description}</Text>
      </View>
  </View>);
  
  }



const styles = StyleSheet.create({
  container:{
    flexGrow:1,
    justifyContent: 'flex-start',
  },
  eventImage:{
    flexShrink: 1,
    height: 120,
    width:'100%',
    resizeMode: 'cover',
  },
  eventInfo:{
    padding:16,
    flexShrink:1,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'flex-start'
  },
  dateContainer:{
    flexGrow: 1,
    backgroundColor:'transparent',
    alignItems:'center',
    justifyContent:'center',
  },
  dateNumber:{
    fontSize: 36,
    color: primaryDark,
    fontWeight: '800',
    lineHeight: 40,
  },
  dateMonth:{
    fontSize: 24,
    color: primaryDark,
    fontWeight: '800',
    textTransform: 'uppercase',
    lineHeight: 28,
    marginTop: -8,
  },
  infoContainer:{
    minWidth: '75%',
    backgroundColor:'transparent',
    justifyContent:'center',
    marginLeft:8,
  },
  eventTitle: {
    fontSize: 24,
    color: primaryDark,
    fontWeight: '600',
  },
  discoverButtonText:{
    fontSize: 16,
    color: primaryCrema,
    fontWeight: '600',
  },
  moreInfo:{
    flex:1,
    paddingHorizontal: 16,
    width:"100%",
    alignItems:'flex-start',
    justifyContent: 'flex-start'
  }
});
