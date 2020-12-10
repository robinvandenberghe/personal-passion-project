import React , { useState, useEffect } from 'react';
import firestore , { Timestamp } from '@react-native-firebase/firestore';
import { Text, View, FlatList, PrimaryButton, Pressable, SecondaryButton, Message} from '../components/Themed';
import { StyleSheet , Dimensions, TextInput , Platform} from 'react-native';
import Colors, { alertDark, errorDark, infoDark, primaryDark, secondaryLight, successDark } from '../constants/Colors';
import AppIcons from '../components/AppIcons';
import useColorScheme from '../hooks/useColorScheme';
import { launchImageLibrary } from 'react-native-image-picker';
import AutoHeightImage from 'react-native-auto-height-image';
import Event from './../components/Event';



export default function PostsScreen() {
  const [ screen, setScreen ] = useState<string>(``);
  const [ error, setError ] = useState<{type:string; subject:string; message:string;}|undefined>();
  const [ value, setValue ] = useState<string>(``);
  const [ info, setInfo ] = useState<{ type:string; subject:string; message:string; }|null>();
  const [ editValue, setEditValue ] = useState<{photo?:any;textValue:string;eventValue?:string;}>({textValue: ``});
  const colorScheme = useColorScheme();
  const windowWidth = Dimensions.get('window').width;

  if(info){
    setTimeout(()=>setInfo(null), 4500);
  }

  const handlePost = async () =>{
    if(editValue.textValue !== `` || editValue.photo || editValue.eventValue){
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
    const options = {
      noData: true,
    }
    launchImageLibrary(options,response => {
      if (response.uri) {
        editValue.photo = response;
        setEditValue({...editValue});
      }
    })
  }

  const handleUploadPhoto = () => {
    return fetch("http://192.168.1.35:80/api/post-photo", {
      method: "POST",
      body: createFormData(editValue.photo, { userId: "123" })
    })
      .then(response => response.json())
      .catch(error => {
        console.log("upload error", error);
      });
  };

  const createFormData = (photo, body) => {
    const data = new FormData();
    data.append("photo", {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
    });
  
    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
  
    return data;
  };


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
                  {editValue.photo?
                    <Pressable style={styles.exampleImageWrapper} onPress={handleChoosePhoto} >
                      <AutoHeightImage width={windowWidth-52}  style={styles.exampleImage}  source={{uri: editValue.photo.uri}} />
                    </Pressable>
                   :editValue.eventValue?
                    <Event event={editValue.eventValue} />
                    :<View style={[styles.buttonLine, {backgroundColor: Colors[colorScheme].postBackground}]}><PrimaryButton onPress={handleChoosePhoto} style={styles.imageButton} label={<AppIcons size={32} color={Colors[colorScheme].text} name={`image`}/>} /><PrimaryButton onPress={handleChoosePhoto} style={styles.imageButton} label={<AppIcons size={32} color={Colors[colorScheme].text} name={`events`}/>} /></View>}
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
  postTypeLine:{
    flexShrink:1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  postType:{
    fontWeight: '500',
    marginRight: 16,
    fontSize:18,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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
  exampleImageWrapper:{
    marginVertical:8,
    width: '100%',
    flexShrink:1,
    maxHeight: 380,
    justifyContent:'center',
    },
  exampleImage:{
    flexShrink:1,
    maxHeight:'100%',
    maxWidth:'100%',
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
});
