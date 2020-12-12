import React , { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Text, View, PrimaryButton, Pressable, SecondaryButton } from '../components/Themed';
import { StyleSheet , Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { alertDark, errorDark, secondaryLight, successDark } from '../constants/Colors';
import AppIcons from '../components/AppIcons';
import { SERVER_URL, APP_API } from '@env';

export default function QuestionsScreen({navigation}:{navigation:any;}) {
  const [ scannedValue, setScannedValue ] = useState<{reward:any; user:any;}>();
  const [ scanHandling, setScanHandling ] = useState(true);

  const PendingView = () => (
    <View style={styles.container}>
      <Text>Waiting</Text>
    </View>
  );

  const handleBarcodeRead = async ({data, type}:{data:string; type:string;}) =>{
    setScanHandling(false);
    if(type=='org.iso.QRCode'){
      if (data.indexOf("/f/") >= 0){
        const result = data.split(`/f/`);
        const r = await firestore().doc(`rewards/${result[0]}`).get();
        const rew = {uid:r.id, ...r.data()};
        const u = await firestore().doc(`users/${result[1]}`).get();
        const us = {uid:u.id, ...u.data()};
        setScannedValue({reward:rew, user:us});
      }
    }
  }

  const handleRewardGiven = async () =>{
    const decrementUser = firestore.FieldValue.increment(-scannedValue.reward.amount);
    const decrementReward = firestore.FieldValue.increment(-1);
    await firestore().doc(`users/${scannedValue.user.uid}`).update({points : decrementUser});
    await firestore().doc(`rewards/${scannedValue.reward.uid}`).update({available : decrementReward});
    setScannedValue(undefined);
    setScanHandling(true);
  }

  return (
    <View style={{ flex: 1,flexGrow:1,}}>
      {scannedValue?
        <>
          <View style={styles.overlay} />
          <View style={styles.scannedContainer}>
            <Image style={styles.scannedImage} source={{uri: `${SERVER_URL}assets/img/drinks/${scannedValue.reward.imageUrl}`, headers:{ 'Authorization': `Bearer ${APP_API}`}}}/>
            <Text style={styles.scannedText}>{`${scannedValue.user.name} wil graag ${scannedValue.reward.amount} punten inruilen voor een ${scannedValue.reward.title}`}</Text>
            <View style={styles.buttonLine}><SecondaryButton style={{alignSelf:'center', marginRight:8,}} onPress={()=>{setScannedValue(undefined);setScanHandling(true);}} label={`Annuleer`} /><PrimaryButton style={{alignSelf:'center'}} onPress={handleRewardGiven} label={`In orde!`} /></View>
          </View>
        </>:<></>}
      <RNCamera
        style={styles.cameraPreview}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We hebben uw toestemming nodig om QR-codes te scannen in de app.',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onBarCodeRead={(e)=>{if(scanHandling)handleBarcodeRead(e)}}
      >
        {({ camera, status }) => {
          if (status !== 'READY') return <PendingView />;
          return (
            <Pressable style={[styles.roundButton, styles.cameraQuitButton]} onPress={()=>navigation.goBack()} >
              <AppIcons size={25} color={'#fff'} name={'cartcross'} />
            </Pressable>
          );
        }}
      </RNCamera>
    </View>
  );

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
  gameButton:{
    marginVertical: 8,
    alignSelf: 'center',
    width: '100%',
  },
  gameButtonWrapper:{
    width:'80%',
    alignSelf:'center',
    position:'relative',
    marginVertical: 8,
  },
  requestLabel:{
    position:'absolute',
    zIndex:3,
    right:-8,
    top:-4,
    width:24,
    height:24,
    flexShrink:1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: alertDark,
    borderRadius:12,
  },
  requestLabelText:{
    fontSize:14,
    fontWeight:'600',
    color: secondaryLight,
  },
  questionContainer:{
    flexShrink:1,
    width:'100%',
    flexDirection: 'row',
    justifyContent:'space-between', 
    marginVertical:4,
  },
  questionText:{
    flexGrow:1,
    maxWidth:'80%',
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
  answerView:{
    flexShrink:1,
    alignItems:'center',
    justifyContent:'center',
    width: '90%',
    alignSelf:'center',
  },  
  spacer:{
    width:'100%',
    flexGrow:112,
  },
  rewardsList:{
    flexShrink:1,
    width: '100%',
  },
  rewardContainer : {
    flexShrink: 1,
    marginVertical:8,
    flexDirection:'row',
    alignItems: 'center',
  },
  rewardTitle : {
    marginLeft:8,
    flexGrow:1,
  },
  rewardImage : {
    width: 40,
    height:40,
    resizeMode:'contain',
  },
  rewardAmount:{
    fontWeight: '600',
    marginRight:8,
  },
  cameraPreview:{
    flexGrow:1,
  },
  cameraQuitButton:{
    position: 'absolute',
    zIndex:5,
    bottom:16,
    backgroundColor: errorDark,
    width:60,
    height:60,
    borderRadius:30,
    alignSelf: 'center',
  },
  scannedContainer:{
    position: 'absolute',
    zIndex:5,
    alignSelf: 'center',
    paddingHorizontal:16,
    paddingVertical: 32,
    borderRadius:16,
    width:'90%',
    top:'20%',
    justifyContent:'center',
    alignItems:'center',
  },
  scannedImage:{
    width: 100,
    height: 100,
    resizeMode:'contain',
  },
  scannedText:{
    textAlign:'center',
    marginVertical:16,
    fontWeight:'600',
  },
  overlay: {
    flexGrow:1,
    position:'absolute',
    zIndex:4,
    width:'100%',
    height:'100%',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  buttonLine:{
    flexDirection: 'row'
  }
});
