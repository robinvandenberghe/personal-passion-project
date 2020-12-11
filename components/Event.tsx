import React, {useState, useEffect} from 'react';
import { StyleSheet, Image } from 'react-native';
import {  primaryCrema, primaryDark, secondaryLight, dropShadow } from '../constants/Colors';
import { useLinkTo } from '@react-navigation/native';
import { Text, View, PrimaryButton } from './Themed';

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
        setEvent(da);
        setImgLink({uri: `http://192.168.1.35/assets/img/events/${da.imageUrl}`});
      } catch (err) {
        console.error(err);
      }
    }
    fetchEvent();
  }, []);

  return (
    <View style={[styles.container]}>
      <Image source={imgLink} style={styles.eventImage}/>
      <View style={styles.eventInfo}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateNumber}>{eventObject.date.toLocaleDateString('nl-BE', {day: '2-digit'})}</Text>
          <Text style={styles.dateMonth}>{eventObject.date.toLocaleDateString('nl-BE', {month:'short'}).slice(0, -1)}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.eventTitle}>{eventObject.titel}</Text>
          <PrimaryButton onPress={() => linkTo(`/event/${eventObject.titel}/${eventObject.id}`)} style={[{alignSelf:'flex-end'}]} label={'Ontdek'}/>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flexGrow:0,
    backgroundColor: secondaryLight,
    marginVertical:8,
    alignSelf: 'center',
    width:"100%",
    overflow: 'hidden',
    borderRadius:8,
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
