import React , { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Text, View, PrimaryButton, Message} from '../components/Themed';
import { StyleSheet , Dimensions, TextInput , Pressable, Platform} from 'react-native';
import Colors, { alertDark, errorDark, successDark , dropShadow} from '../constants/Colors';
import AppIcons from '../components/AppIcons';
import useColorScheme from '../hooks/useColorScheme';
import ImagePicker from 'react-native-image-crop-picker';
import Event from './../components/Event';
import Carousel, { Pagination, ParallaxImage, AdditionalParallaxProps } from 'react-native-snap-carousel';


export default function PostsScreen() {
  const [ screen, setScreen ] = useState<string>(``);
  const [ error, setError ] = useState<{type:string; subject:string; message:string;}|undefined>();
  const [ value, setValue ] = useState<string>(``);
  const [ activeSlide, setActiveSlide ] = useState<number>(0);
  const [ info, setInfo ] = useState<{ type:string; subject:string; message:string; }|null>();
  const [ editValue, setEditValue ] = useState<{images?:any[];textValue:string;eventValue?:string;}>({textValue: ``});
  const colorScheme = useColorScheme();
  const {width: windowWidth} = Dimensions.get('window');


  if(info){
    setTimeout(()=>setInfo(null), 4500);
  }

  const handlePost = async () =>{
    if(editValue.textValue !== `` || editValue.images || editValue.eventValue){
      let input = {date: firestore.Timestamp.now()};
      if(editValue.textValue !== ``){
        input.message = editValue.textValue; 
      }
      if(editValue.eventValue !== ``){
        input.message = editValue.textValue;
      }
      const newDoc = await firestore().collection('posts').add(input);
      if(newDoc){
        const files = await handleUploadPhoto();
        setEditValue({textValue: ``});
        setInfo({type: `success`, subject: `newPost`, message:`Post succesvol geplaatst!`});
      }else{
        setInfo({type: `error`, subject: `newPost`, message:`Er liep iets mis tijdens het plaatsen van je post, probeer opnieuw!`});
      }
    }else{
      setInfo({type: `error`, subject: `newPost`, message:`Vul eerst iets in.`});
    }

    
  }

  const handleChoosePhoto = () => {
    ImagePicker.openPicker({
      multiple: true,
      maxFiles: 10,
      compressImageMaxWidth: 750,
      compressImageMaxHeight: 750,
      compressImageQuality:0.75,
      forceJpg: true,

    }).then(images => {
      if(images){
        editValue.images = images;
        setEditValue({...editValue});   
      } 

    }).catch((error) => {
      if (error.code === 'E_PICKER_CANCELLED' && editValue.images.length>0) {
        editValue.images = undefined;
        setEditValue({...editValue});   
      }
    });
  }

  const handleUploadPhoto = () => {
    return fetch("http://192.168.1.35:80/api/post-photo", {
      method: "POST",
      body: createFormData(editValue.images, { userId: "123" })
    })
      .then(response => response.json())
      .catch(error => {
        console.log("upload error", error);
      });
  };

  const createFormData = (photoArray, body) => {
    const data = new FormData();
    photoArray.map(photo=>{
      data.append("photo", {
        name: photo.fileName,
        type: photo.type,
        uri:
          Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
      });
    });
 
    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
  
    return data;
  };

  const renderImage = (renderItem: { item: any; index: number; }, parallaxProps?: AdditionalParallaxProps) =>{
    const { item } = renderItem;
    return <ParallaxImage parallaxFactor={0.4} style={styles.exampleImage} containerStyle={styles.imageContainer} source={{uri: item.path}} {...parallaxProps} />;
  }


  switch(screen){
    default:
      return(
        <View style={[styles.container]} >
          <Text style={styles.title}>Plaats een nieuw bericht</Text>
          <Text>Welk bericht wil je plaatsen?</Text>
          {info && info.subject===`newPost`? <Message type={info.type} message={info.message} /> : null}
          <View style={styles.postContainer}>
            <View>
                <Text style={[styles.subtext, {color: Colors[colorScheme].labelColor}]}>voorbeeld</Text>
                <View style={[styles.postExample, {backgroundColor: Colors[colorScheme].postBackground}]}>
                  <Text style={[styles.subtext, {color: Colors[colorScheme].labelColor}]}>5 minuten geleden</Text>
                  <TextInput style={[styles.multiLineInput, {color: Colors[colorScheme].text}] }  blurOnSubmit placeholder={`Begin met typen ...`} placeholderTextColor={Colors[colorScheme].labelColor}  keyboardType={`default`}  multiline onChangeText={text => {editValue.textValue = text; setEditValue({...editValue});}} value={editValue.textValue}/>
                  {editValue.images?
                    <Pressable onPress={handleChoosePhoto}>
                      <Carousel
                        data={editValue.images}
                        renderItem={renderImage}
                        onSnapToItem={(index) => setActiveSlide(index) }
                        itemWidth={windowWidth - 68}
                        sliderWidth={windowWidth - 52}
                        sliderHeight={windowWidth}
                        hasParallaxImages
                        containerCustomStyle={styles.carousel}
                        loop
                        ref={(c) => { this._carousel = c; }}
                      />
                      <Pagination
                        carouselRef={this._carousel}
                        tappableDots
                        dotsLength={editValue.images.length}
                        activeDotIndex={activeSlide}
                        dotStyle={[styles.dotStyle, {backgroundColor: Colors[colorScheme].text}]}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                      />
                    </Pressable>
                   :editValue.eventValue?
                    <Event event={editValue.eventValue} />
                    :<View style={[styles.buttonLine, {backgroundColor: Colors[colorScheme].postBackground}]}><PrimaryButton onPress={handleChoosePhoto} style={styles.imageButton} label={<AppIcons size={32} color={Colors[colorScheme].background} name={`image`}/>} /><PrimaryButton onPress={handleChoosePhoto} style={styles.imageButton} label={<AppIcons size={32} color={Colors[colorScheme].background} name={`events`}/>} /></View>}
                </View>
                <PrimaryButton onPress={handlePost} style={styles.postButton} label={`Plaatsen`} />
              </View>
          </View>
        </View>
      );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow:1,
    padding:16,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom:16,
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
  backButton:{
    marginBottom: 8,
  },
  input:{
    alignSelf:'center',
    marginVertical:16,
  }, 
  spacer:{
    width:'100%',
    flexGrow:112,
  },
  postContainer:{
    marginTop:16,
    maxHeight:400,
  },
  buttonContainer:{
    flexShrink:1,
    width:'100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:'space-between',
  }, 
  buttonWrapper:{
    paddingHorizontal:16,
    paddingVertical:8,
    borderRadius:8,
    justifyContent:'center',
    alignItems:'center',
    minWidth:88,
  },
  subtext:{
    fontSize:14,
  },
  postButton:{
    alignSelf: 'flex-end',
    marginTop:8,
  },
  postExample:{
    flexShrink:1,
    padding:10,
    borderRadius:8,
    ...dropShadow,
    marginVertical:8,
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
  imageButton:{
    marginVertical:8,
    marginRight: 8,
    flexShrink:1,    
  },
  buttonLine:{
    flexDirection: 'row',
    flexShrink:1,
    flexWrap: 'wrap',
  },
  exampleImage:{
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
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
    marginHorizontal: 8,
  },
  carousel:{
    flex:1,
    maxHeight: 320,
    marginVertical: 8,
  }
});
