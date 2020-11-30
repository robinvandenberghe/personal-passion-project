import * as WebBrowser from 'expo-web-browser';
import React, {useState, useEffect} from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors, { secondaryCrema, secondaryLight } from '../constants/Colors';
import firestore from '@react-native-firebase/firestore';
import { Text, SwitchView } from './Themed';
import Event from './Event';

export default function Post(post:any) {
  const { date } = post.post.item;
  return (
    <SwitchView style={styles.container}>
      <Text style={styles.subText}>{parsePostingTime(date.toDate())}</Text>
      {parsePostView(post.post.item)}
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

const parsePostView =  (post: {type: string; event?: string; message?:string }) => {
  const {type, event, message} = post;
  switch(type){
    case 'event':
      return <Event event={event} />;
    case 'message':
  return <Text style={styles.message}>{message}</Text>
  }

}

const styles = StyleSheet.create({
  container: {
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

});
