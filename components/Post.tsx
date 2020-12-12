import React, { useState } from 'react';
import { StyleSheet, Dimensions, Platform, View, TextInput } from 'react-native';
import Colors, { alertDark, dropShadow, errorDark, secondaryLight, successDark} from '../constants/Colors';
import { Text, SwitchView, Pressable } from './Themed';
import Event from './Event';
import Carousel, { Pagination, ParallaxImage , AdditionalParallaxProps} from 'react-native-snap-carousel';
import useColorScheme from '../hooks/useColorScheme';
import { SERVER_URL , APP_API } from "@env";
import { useGlobalState } from '../state';
import AppIcons from './AppIcons';
import firestore from '@react-native-firebase/firestore';

export default function Post({post, index, posts, setPosts}:{post:any; index:number; posts:any; setPosts:any;}) {
  const { date, message, event , images, uid } = post;
  const {width: windowWidth} = Dimensions.get('window');
  const [ activeSlide, setActiveSlide ] = useState(0);
  const [ editing, setEditing ] = useState<boolean>(false);
  const [ editValue, setEditValue ] = useState<string>(message? message :``);
  const [ user, setUser ] = useGlobalState('user');
  const colorScheme = useColorScheme();
  const renderImage = (renderItem: { item: any; index: number; }, parallaxProps?: AdditionalParallaxProps) =>{
    const { item } = renderItem;
    return <ParallaxImage parallaxFactor={0.4} style={styles.postImage} containerStyle={styles.imageContainer} source={{uri: `${SERVER_URL}assets/img/posts/${item}`, headers: { 'Authorization': `Bearer ${APP_API}`},}} {...parallaxProps} />;
  }

  const handleDeletePost = async () => {
    if(images){
      images.map((img) => {
        fetch(`${SERVER_URL}assets/img/posts/${img}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${APP_API}`},
        })
        .catch((err)=>{console.error(err)});
      });
    }
    await firestore().doc(`posts/${uid}`).delete();
  }

  const handleSavePost = async () => {
    await firestore().doc(`posts/${uid}`).update({message: editValue}).then(()=>setEditing(false)).catch((err)=>console.error(err));
    posts[index].message = editValue;
    setPosts([...posts]);
  }

  return (
    <SwitchView style={styles.container}>
      <View style={styles.topLine}><Text style={styles.subText}>{parsePostingTime(date.toDate())}</Text>{user.role==`admin`? <View style={{flexDirection:'row'}}><Pressable onPress={handleDeletePost} style={[styles.roundButton, styles.rejectButton]}><AppIcons size={16} color={secondaryLight} name={`cartcross`} /></Pressable>{message?editing?<Pressable onPress={handleSavePost} style={[styles.roundButton, styles.approveButton]}><AppIcons size={20} color={secondaryLight} name={`save`} /></Pressable>:<Pressable onPress={()=>setEditing(true)} style={[styles.roundButton, styles.editButton]}><AppIcons size={20} color={secondaryLight} name={`posts`} /></Pressable>:null}</View> :null}</View>
      {message? editing? <TextInput style={[styles.multiLineInput, {color: Colors[colorScheme].text}] }  blurOnSubmit placeholder={`Begin met typen ...`} placeholderTextColor={Colors[colorScheme].labelColor}  keyboardType={`default`}  multiline onChangeText={text =>setEditValue(text)} value={editValue}/> : <Text style={styles.message}>{message}</Text> :null}
      {event? <Event event={event} /> :null}
      {images?
        <>
        <Carousel
          data={images}
          renderItem={renderImage}
          onSnapToItem={(index) => setActiveSlide(index) }
          itemWidth={windowWidth - 68}
          sliderWidth={windowWidth - 52}
          sliderHeight={windowWidth}
          hasParallaxImages
          containerCustomStyle={styles.carousel}
          loop
        />
        <Pagination
          dotsLength={images.length}
          activeDotIndex={activeSlide}
          dotStyle={[styles.dotStyle, {backgroundColor: Colors[colorScheme].text}]}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          containerStyle={{marginVertical:-24}}
        />
      </>:null}
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
    ...dropShadow
  },
  topLine:{
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    ...StyleSheet.absoluteFillObject,
    resizeMode:'contain'
  },
  imageContainer:{
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}),
    borderRadius: 8,
  },
  dotStyle:{
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  carousel:{
    flex:1,
    height: 320,
    marginVertical: 8,
  },
  roundButton:{
    width:40,
    height:40,
    flexShrink:1,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:20,
  },
  editButton:{
    backgroundColor: alertDark,
  },
  rejectButton:{
    backgroundColor: errorDark,
    marginRight:4,
  },
  approveButton:{
    backgroundColor: successDark,
  },
  multiLineInput:{
    flexShrink:1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding:0,
    marginVertical:8,
    fontSize:16,
  },
});
