import React , { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Text, View, FlatList, PrimaryButton, Pressable, SecondaryButton} from '../components/Themed';
import { StyleSheet , Image, TextInput } from 'react-native';
import Colors, { alertDark, errorDark, infoDark, primaryDark, secondaryLight, successDark } from '../constants/Colors';
import { useGlobalState } from '../state';
import AppIcons from '../components/AppIcons';
import useColorScheme from '../hooks/useColorScheme';


export default function QuestionsScreen() {
  const [ screen, setScreen ] = useState<string>(``);
  const [ error, setError ] = useState<{type:string; subject:string; message:string;}|undefined>();
  const [ value, setValue ] = useState<string>(``);
  const [ info, setInfo ] = useState<{ type:string; subject:string; message:string; }|null>();
  const [ editValue, setEditValue ] = useState<{type:string;}>();
  const [ newPost, setNewPost ] = useState<string>(``);
  const colorScheme = useColorScheme();

  const handlePost = async () =>{

  }


  switch(screen){
    default:
      return(
        <View style={[styles.container]} >
          <Text style={styles.title}>Plaats een nieuw bericht</Text>
          <Text>Welk bericht wil je plaatsen?</Text>
          <View style={styles.postContainer}>
            {newPost?
              newPost==`post`?
              <View>
                <Pressable style={styles.postTypeLine} onPress={()=>setNewPost(``)}>
                  <Text style={styles.postType}>Bericht</Text>
                  <AppIcons size={18} color={Colors[colorScheme].labelColor} name={`posts`} />
                </Pressable>
                <Text style={[styles.subtext, {color: Colors[colorScheme].labelColor}]}>voorbeeld</Text>
                <View style={[styles.postExample]}>
                  <Text style={[styles.subtext, {color: Colors[colorScheme].labelColor}]}>5 minuten geleden</Text>
                  <TextInput style={[styles.multiLineInput, {color: Colors[colorScheme].text}] }  blurOnSubmit placeholder={`Begin met typen ...`}  keyboardType={`default`}  multiline={true} autoFocus={true} onChange={text => {editValue.textValue = text; setEditValue({...editValue});}} value={editValue.textValue}/>
                </View>
                <PrimaryButton onPress={handlePost} style={styles.postButton} label={`Plaatsen`} />
              </View>
              :newPost==`image`?
              <View></View>
              :newPost==`album`?
              <View></View>
              :null
            :
            <View style={styles.buttonContainer}>
              <Pressable style={[styles.buttonWrapper, {backgroundColor: Colors[colorScheme].text}]} onPress={()=>{ setNewPost(`post`); setEditValue({type:`post`, textValue: ``})}}>
                <AppIcons size={30} color={Colors[colorScheme].background} name={`post`} />
                <Text style={{color: Colors[colorScheme].background, marginTop:8}}>Bericht</Text>
              </Pressable>
              <Pressable style={[styles.buttonWrapper, {backgroundColor: Colors[colorScheme].text}]} onPress={()=>setNewPost(`image`)}>
                <AppIcons size={30} color={Colors[colorScheme].background} name={`image`} />
                <Text style={{color: Colors[colorScheme].background, marginTop:8}}>Foto</Text>
              </Pressable>
              <Pressable style={[styles.buttonWrapper, {backgroundColor: Colors[colorScheme].text}]} onPress={()=>setNewPost(`album`)}>
                <AppIcons size={30} color={Colors[colorScheme].background} name={`album`} />
                <Text style={{color: Colors[colorScheme].background, marginTop:8}}>Album</Text>
              </Pressable>
            </View>}
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
    padding:8,
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
});
