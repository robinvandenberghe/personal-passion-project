import React, {useState, useEffect} from 'react';
import { StyleSheet, Image } from 'react-native';
import {  primaryCrema, primaryDark, secondaryLight } from '../constants/Colors';
import storage from '@react-native-firebase/storage';
import { useLinkTo } from '@react-navigation/native';
import { Text, View, Pressable } from './Themed';

export default function Event(post: { event: any; }) {
  const { event} = post;
  const [eventObject, setEvent] = useState({imageUrl: "", date: new Date(), titel: "", id: ""});
  const [imgLink, setImgLink] = useState(require('./../assets/images/eventDefault.jpg'))
  const linkTo = useLinkTo();

  useEffect(() => {
    async function fetchEvent() {
      try {
        const d = await event.get();
        const da = d.data();
        da.date = da.date.toDate();
        da.id = d.id;
        da.imageUrl = null;
        setEvent(da);
        if(eventObject){
          // const url = await storage().ref(`events/${eventObject.imageUrl}`).getDownloadURL();
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
        <Text style={styles.dateNumber}>{eventObject.date.toLocaleDateString('nl-BE', {day: '2-digit'})}</Text>
        <Text style={styles.dateMonth}>{eventObject.date.toLocaleDateString('nl-BE', {month:'short'}).slice(0, -1)}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.eventTitle}>{eventObject.titel}</Text>
        <Pressable onPress={() => linkTo(`/event/${eventObject.titel}/${eventObject.id}`)}style={[{alignSelf:'flex-end'}]}><Text style={styles.discoverButtonText}>Ontdek</Text></Pressable>
      </View>
    </View>
  </View>);
  
  }



const styles = StyleSheet.create({
  container:{
    flexShrink:1,
    backgroundColor: secondaryLight,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical:8,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    width:"100%",
  },
  eventImage:{
    height: 120,
    width: '100%',
    resizeMode: 'cover',
  },
  eventInfo:{
    backgroundColor: secondaryLight,
    padding:8,
    flexShrink:1,
    flexDirection: 'row',
    justifyContent:'center',
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
  }
});
