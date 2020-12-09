import React , { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Text, View, FlatList, PrimaryButton, Pressable, SecondaryButton} from '../components/Themed';
import { StyleSheet , Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Colors, { alertDark, errorDark, infoDark, primaryDark, secondaryLight, successDark } from '../constants/Colors';
import { useGlobalState } from '../state';
import AppIcons from '../components/AppIcons';


export default function QuestionsScreen() {
  const [ screen, setScreen ] = useState<string>(``);
  const [ error, setError ] = useState<{type:string; subject:string; message:string;}|undefined>();
  const [ value, setValue ] = useState<string>(``);
  const [ info, setInfo ] = useState<{ type:string; subject:string; message:string; }|null>();
  const [ rewards , setRewards] = useState<{uid:string; amount:number; available:number; imageUrl:string; title:string; }[]>([]);
  const [ scannedValue, setScannedValue ] = useState<{reward:any; user:any;}>();
  const [ scanHandling, setScanHandling ] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        firestore().collection("rewards").where('available', '>', 0).onSnapshot((snap) => {
          if(snap&&snap.size>0){
            const a:{uid:string; amount:number; available:number; imageUrl:string; title:string; }[] = snap.docs.map((item) => {
              const temp = item.data();
              return {uid: item.id, amount: temp.amount, available: temp.available, imageUrl: temp.imageUrl, title: temp.title};
            });
            setRewards(a);
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchRewards();
  }, []);

  const PendingView = () => (
    <View style={styles.container}>
      <Text>Waiting</Text>
    </View>
  );

  const Reward = ({reward}:{reward:{uid:string; amount:number; available:number; imageUrl:string; title:string; };}) => {
    const [imgLink, setImgLink] = useState({uri: `https://robinvandenb.be/assets/img/kalfapp/${reward.imageUrl}`});
    return (
      <View style={styles.rewardContainer}>
        <Image source={imgLink} style={styles.rewardImage}/>
        <Text style={styles.rewardTitle}>{reward.title}</Text>
        <Text style={styles.rewardAmount}>{reward.amount.toString()}</Text>
        <Pressable style={[styles.roundButton,styles.editButton]} onPress={()=>{}}><AppIcons size={18} color={secondaryLight} name={'posts'} /></Pressable>
      </View>
    );
  }

  const handleRejection = async ({questionProposal}:{questionProposal:any;}) =>{
    const { uid} = questionProposal;
    await firestore().doc(`questionRequests/${uid}`).delete();
  }

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

  switch(screen){
    case `scanCode`:
      return (
        <View style={{ flex: 1,flexGrow:1,}}>
          {scannedValue?
            <>
              <View style={styles.overlay} />
              <View style={styles.scannedContainer}>
                <Image style={styles.scannedImage} source={{uri: `https://robinvandenb.be/assets/img/kalfapp/${scannedValue.reward.imageUrl}`}}/>
                <Text style={styles.scannedText}>{`${scannedValue.user.name} wil graag ${scannedValue.reward.amount} punten inruilen voor een ${scannedValue.reward.title}`}</Text>
                <PrimaryButton style={{alignSelf:'center'}} onPress={handleRewardGiven} label={`In orde!`} />
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
                <Pressable style={[styles.roundButton, styles.cameraQuitButton]} onPress={()=>setScreen(``)} >
                  <AppIcons size={25} color={'#fff'} name={'cartcross'} />
                </Pressable>
              );
            }}
          </RNCamera>
        </View>
      );
    case `editRewards`:
      return(
        <View style={[styles.container]} >
          <Text style={styles.title}>Beheer beloningen</Text>
          <SecondaryButton style={styles.backButton} onPress={()=>{setScreen(``)}} label={`Terug`} />
          <FlatList
          style={styles.rewardsList}
          data={rewards}
          renderItem={({item, index}) => <Reward reward={item} />}
          showsVerticalScrollIndicator ={false}
          showsHorizontalScrollIndicator={false} 
          keyExtractor={(item, index) => index.toString()} 
          />
        </View>
      );
    default:
      return(
        <View style={[styles.container]} >
          <Text style={styles.title}>Beheer beloningen</Text>
          <Text>Kies een optie</Text>
          <View style={{flexGrow:1, justifyContent:'center'} }>
            <View style={styles.gameButtonWrapper}><PrimaryButton style={styles.gameButton}  onPress={()=>{setScreen(`editRewards`)}} label={`Beheer beloningen`} /></View>
            <View style={styles.gameButtonWrapper}><PrimaryButton style={styles.gameButton}  onPress={()=>{setScreen(`scanCode`)}} label={`Scan QR-code`} /></View>
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
});

const makeTitle = (slug) => {
  var words = slug.split('-');
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }
  return words.join(' ');
}
const slugify = text =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')