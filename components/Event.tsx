import React, {useState, useEffect} from 'react';
import { StyleSheet, Image } from 'react-native';
import {  primaryCrema, primaryDark, secondaryLight, dropShadow } from '../constants/Colors';
import { useLinkTo } from '@react-navigation/native';
import { Text, View, PrimaryButton } from './Themed';
import { SERVER_URL , APP_API } from "@env";

export default function Event({ event }:{ event: any; }) {
  const [ eventObject, setEvent ] = useState({imageUrl: "", date: new Date(), title: "", id: ""});
  const [ imgLink, setImgLink ] = useState(require('./../assets/images/eventDefault.jpg'))
  const linkTo = useLinkTo();

  useEffect(() => {
    async function fetchEvent() {
      try {
        const d = await event.get();
        const da = d.data();
        da.date = da.date.toDate();
        da.id = d.id;
        setEvent(da);
        setImgLink({uri: `${SERVER_URL}assets/img/events/${da.imageUrl}`, headers:{ 'Authorization': `Bearer ${APP_API}`}});
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
          <Text style={styles.eventTitle}>{eventObject.title}</Text>
          <PrimaryButton onPress={() => linkTo(`/event/${slugify(eventObject.title)}/${eventObject.id}`)} style={[{alignSelf:'flex-end'}]} label={'Ontdek'}/>
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
    borderRadius:8,
    ...dropShadow
  },
  eventImage:{
    height: 120,
    width: '100%',
    resizeMode: 'cover',    
    borderTopLeftRadius:8,
    borderTopRightRadius:8,
    overflow: 'hidden',
  },
  eventInfo:{
    backgroundColor: secondaryLight,
    padding:8,
    flexShrink:1,
    flexDirection: 'row',
    justifyContent:'center',
    borderRadius:8,

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

const slugify = (text) =>  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')