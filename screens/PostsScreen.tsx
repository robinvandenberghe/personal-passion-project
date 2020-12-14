import React , { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Text, View, PrimaryButton, Message, FlatList, } from '../components/Themed';
import { StyleSheet , Dimensions, TextInput , Pressable, Platform} from 'react-native';
import Colors, { alertDark, errorDark, successDark , dropShadow, primaryLight} from '../constants/Colors';
import AppIcons from '../components/AppIcons';
import useColorScheme from '../hooks/useColorScheme';
import ImagePicker from 'react-native-image-crop-picker';
import Event from './../components/Event';
import Carousel, { Pagination, ParallaxImage, AdditionalParallaxProps } from 'react-native-snap-carousel';
import { SERVER_URL, APP_API } from "@env";
import Modal from 'react-native-modal';


export default function PostsScreen() {
  const [ screen, setScreen ] = useState<string>(``);
  const [ activeSlide, setActiveSlide ] = useState<number>(0);
  const [ isModalVisible, setModalVisible ] = useState<boolean>(false);
  const [ isFetching, setFetching ] = useState<boolean>(false);
  const [ events, setEvents ] = useState<{ref:any; title:string;}[]>();
  const [ info, setInfo ] = useState<{ type:string; subject:string; message:string; }|null>();
  const [ editValue, setEditValue ] = useState<{images?:any[];textValue:string;eventValue?:string;}>({textValue: ``});
  const colorScheme = useColorScheme();
  const {width: windowWidth} = Dimensions.get('window');

  if(info){
    setTimeout(()=>setInfo(null), 4500);
  }

  const handlePost = async () =>{
    if(editValue.textValue !== `` || editValue.images || editValue.eventValue){
      let input:{date:any; message?:string; event?:any;} = {date: firestore.Timestamp.now()};
      if(editValue.textValue !== ``){
        input.message = editValue.textValue; 
      }
      if(editValue.eventValue){
        input.event = editValue.eventValue;
      }
      const newDoc = await firestore().collection('posts').add(input);
      if(newDoc){
        if(editValue.images){
          handleUploadPhoto().then(response => {
            if(response){
              const images = response.uploadedImages.map(img => img.filename);
              firestore().doc(`posts/${newDoc.id}`).update({images}).then(()=>{
                setEditValue({textValue: ``});
                setInfo({type: `success`, subject: `newPost`, message:`Post succesvol geplaatst!`});
              }).catch((err)=>{
                setInfo({type: `error`, subject: `profileImage`, message:`Er liep iets mis tijdens het uploaden van de afbeeldingen.`});
              });
            }else{
            setInfo({type: `error`, subject: `profileImage`, message:`Er liep iets mis tijdens het uploaden van de afbeeldingen.`});
            }
          }).catch((err)=>{
            setInfo({type: `error`, subject: `profileImage`, message:`Er liep iets mis tijdens het uploaden van de afbeeldingen.`});
          });
        }else{
          setEditValue({textValue: ``});
          setInfo({type: `success`, subject: `newPost`, message:`Post succesvol geplaatst!`});
        }
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
    });
  }

  const handleUploadPhoto = () => {
    return fetch(`${SERVER_URL}api/post-photo`, {
      method: "POST",
      body: createFormData(editValue.images, { userId: "123",  }),
      headers: { 
        'Authorization': `Bearer ${APP_API}`,
      }
    })
      .then(response => response.json())
      .catch(error => {
        setInfo({type: `error`, subject: `newPost`, message:`Er liep iets fout tijdens het uploaden van de foto's.`});
      });
  };

  const createFormData = (photoArray, body) => {
    const data = new FormData();
    photoArray.map((photo)=>{
      data.append(`photo`, {
        name: photo.filename,
        type: photo.type,
        uri:
          Platform.OS === "android" ? photo.sourceURL : photo.sourceURL.replace("file://", "")
      });
    });
 
    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
  
    return data;
  };

  const renderImage = (renderItem: { item: any; index: number; }, parallaxProps?: AdditionalParallaxProps) =>{
    const { item } = renderItem;
    return <ParallaxImage parallaxFactor={0.4} style={styles.exampleImage} containerStyle={styles.imageContainer}  source={{uri: item.path}} {...parallaxProps} />;
  }

  const EventSelect = ({event}:{event:{ref:any; title:string;}}) =>{
    const {title, ref } = event;
    return (
      <View style={styles.eventWrapper}>
        <Text style={styles.eventTitle}>{title}</Text>
        <PrimaryButton onPress={()=>{
          editValue.eventValue = ref;
          setEditValue({...editValue});
          setModalVisible(false);
        }} label={`Selecteer`} />
      </View>
    );
  }

  useEffect(()=>{
    const fetchEvents = async () => {
      if(isFetching){
        const evRef = await firestore().collection(`events`).where(`date`,`>=`,firestore.Timestamp.now()).get();
        if(evRef && evRef.size>0){
          const evTemp = evRef.docs.map((item)=>{
            const itTemp = item.data();
            return {ref:item.ref, title: itTemp.title,};
          });
          setFetching(false);
          setEvents(evTemp);
        }else{
          setFetching(false);
        }
      }
    }
    fetchEvents();
  },[isFetching]);

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
                    <View style={styles.carouselWrapper}>
                      <Carousel
                        data={editValue.images}
                        renderItem={renderImage}
                        onSnapToItem={(index) => setActiveSlide(index) }
                        itemWidth={windowWidth - 68}
                        sliderWidth={windowWidth - 52}
                        sliderHeight={windowWidth + 6}
                        hasParallaxImages
                        containerCustomStyle={styles.carousel}
                        loop
                      />
                      <Pagination
                        dotsLength={editValue.images.length}
                        activeDotIndex={activeSlide}
                        dotStyle={[styles.dotStyle, {backgroundColor: Colors[colorScheme].text}]}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        containerStyle={{marginVertical:-24}}
                      />
                      <View style={styles.editPhotoLine}>                      
                        <Pressable onPress={()=>{
                            editValue.images = undefined;
                            setEditValue({...editValue});   
                          }} 
                          style={[styles.roundButton, styles.rejectButton]}>
                          <AppIcons size={16} color={primaryLight} name={`cartcross`} />
                        </Pressable>
                        <Pressable onPress={handleChoosePhoto} style={[styles.roundButton, styles.editButton]}><AppIcons size={18} color={primaryLight} name={`posts`} /></Pressable>
                      </View>
                    </View>
                   :editValue.eventValue?
                    <View style={styles.carouselWrapper}>
                      <Event event={editValue.eventValue} />
                      <View style={styles.editPhotoLine}>                      
                        <Pressable onPress={()=>{
                            editValue.eventValue = undefined;
                            setEditValue({...editValue});   
                          }} 
                          style={[styles.roundButton, styles.rejectButton]}>
                          <AppIcons size={16} color={primaryLight} name={`cartcross`} />
                        </Pressable>
                        <Pressable onPress={()=>{setModalVisible(true); setFetching(true);}} style={[styles.roundButton, styles.editButton]}><AppIcons size={18} color={primaryLight} name={`posts`} /></Pressable>
                      </View>
                    </View>
                    :<View style={[styles.buttonLine, {backgroundColor: Colors[colorScheme].postBackground}]}><PrimaryButton onPress={handleChoosePhoto} style={styles.imageButton} label={<AppIcons size={32} color={primaryLight} name={`image`}/>} /><PrimaryButton onPress={()=>{setModalVisible(true); setFetching(true);}} style={styles.imageButton} label={<AppIcons size={32} color={primaryLight} name={`events`}/>} /></View>}
                </View>
                <PrimaryButton onPress={handlePost} style={styles.postButton} label={`Plaatsen`} />
                <Modal isVisible={isModalVisible}>
                  <View style={styles.modal}>
                    <FlatList
                      data={events}
                      renderItem={({item, index}) => <EventSelect event={item} />}
                      showsVerticalScrollIndicator ={false}
                      refreshing={isFetching}
                      onRefresh={()=>setFetching(true)}
                      keyExtractor={(item, index) => index.toString()} 
                      scrollEnabled
                      />    
                  </View>
                </Modal>
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
    marginBottom: Platform.select({ios: 0, android: 1}),
    borderRadius: 8,
    flex:1,
  },
  dotStyle:{
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  carouselWrapper:{
    width:'100%',
    position: 'relative',
    backgroundColor:'transparent',
  },
  carousel:{
    height: 320,
    marginVertical: 8,
    flexGrow:0,
    flex:0,
  },
  editPhotoLine:{
    position:'absolute',
    top:8,
    right:8,
    flexDirection: 'row',
    flexShrink:1,
    backgroundColor:'transparent',
  },
  modal:{
    height: '33%',
    bottom:0,
    borderRadius:8,
    padding:8,
  },
  eventWrapper:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    marginVertical:8,
    width: '100%',
  },
  eventTitle:{
    flexGrow:1,
    fontSize: 18,
    fontWeight: '500',
  }
});
