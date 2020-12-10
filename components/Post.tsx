import * as WebBrowser from 'expo-web-browser';
import React, {useState, useEffect} from 'react';
import { StyleSheet, TouchableOpacity , Dimensions } from 'react-native';
import Colors, { secondaryCrema, secondaryLight } from '../constants/Colors';
import firestore from '@react-native-firebase/firestore';
import { Text, SwitchView } from './Themed';
import Event from './Event';
import AutoHeightImage from 'react-native-auto-height-image';


export default function Post({post}:{post:any}) {
  const { date, message, event , imageUrl} = post.item;
  const windowWidth = Dimensions.get('window').width;

  return (
    <SwitchView style={styles.container}>
      <Text style={styles.subText}>{parsePostingTime(date.toDate())}</Text>
      {message? <Text style={styles.message}>{message}</Text> :null}
      {event? <Event event={event} /> :null}
      {imageUrl? <AutoHeightImage width={windowWidth-52}  style={styles.postImage}  source={{uri: `http://192.168.1.35/assets/img/posts/${imageUrl}`}} /> :null}
    </SwitchView>
  );
}

const parsePostingTime = (date: any) =>{
  const diff = date_diff_inminutes(date, new Date());
  if(diff == 0){
      return 'Zojuist';
  }else if(diff<=60){
    return `${diff}m geleden`;
  }else if(diff>60 && (diff/60)<24){
    return `${Math.round(diff/60)}u geleden`;
  }else{
    const displayDate = new Date(date);
    return `${displayDate.toLocaleDateString('nl-BE')} - ${displayDate.toLocaleTimeString('nl-BE', {hour: '2-digit', minute:'2-digit'})}`;
  }
}

const date_diff_inminutes = (date1: any, date2: any) => {
  const dt1 = new Date(date1);
  const dt2 = new Date(date2);
  return Math.round((dt2.getTime() - dt1.getTime()) / 1000 / 60  );
}

const styles = StyleSheet.create({
  container: {
    minWidth:'99%',
    maxWidth: '100%',
    flexShrink:1,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  subText:{
    fontSize: 14,
    fontWeight: '500',
  },
  message:{
    marginTop:8,
    fontSize: 16,
  },
  postImage:{
    marginVertical:8,
    width: '100%',
    maxHeight: 380,
  },

});
