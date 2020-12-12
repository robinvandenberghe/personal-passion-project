import React, {useState, useEffect} from 'react';
import { StyleSheet, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Text, View, FlatList, PrimaryButton, SecondaryButton} from '../components/Themed';
import Colors, { primaryGrey, secondaryGrey } from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { useGlobalState } from '../state';
import QRCode from 'react-native-qrcode-svg';
import { SERVER_URL } from '@env';

export default function SettingsScreen() {
  const [user, setUser] = useGlobalState('user');
  const [ max, setMax ] = useState(Math.ceil(user.points/100)*100);
  const [ percentage, setPercentage ] = useState((user.points/max)*100);
  const [ score, setScore ] = useState(user.points);
  const [ rewards, setRewards ] = useState<{uid:string; amount:number; available:number; imageUrl:string; title:string; }[]>([]);
  const [ screen, setScreen ] = useState<string>(``);
  const [ chosenReward, setChosenReward ] = useState<{uid:string; amount:number; available:number; imageUrl:string; title:string; }>();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchScores = async () => {
      try {
        firestore().doc(`users/${user.uid}`).onSnapshot(snap => {
          const sc = snap.data().points;
          const mx = Math.ceil(sc/100)*100;
          setScore(sc);
          setMax(mx)
          setPercentage((sc/mx)*100);
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchScores();
    const fetchRewards = async () => {
      try {
        firestore().collection("rewards").where('available', '>', 0).onSnapshot((snap) => {
          if(snap&&snap.size>0){
            const a = snap.docs.map((item) => {
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

  const handleExchangePoints = (reward) =>{
    setChosenReward(reward);
    setScreen(`exchangePoints`);
  }

  const Reward = ({reward}:{reward:{uid:string; amount:number; available:number; imageUrl:string; title:string; };}) => {
    const [imgLink, setImgLink] = useState({uri: `${SERVER_URL}assets/img/drinks/${reward.imageUrl}`});
    return (
      <View style={styles.rewardContainer}>
        <Image source={imgLink} style={styles.rewardImage}/>
        <Text style={styles.rewardTitle}>{reward.title}</Text>
        <Text style={styles.rewardAmount}>{reward.amount.toString()}</Text>
        <PrimaryButton style={styles.exchangeButton} disabled={score<reward.amount?true: false} onPress={()=>handleExchangePoints(reward)} label={`Inruilen`}/>
      </View>
    );
  }

  switch(screen){
    case `exchangePoints`:
      return(
        <View style={styles.container}>
        <Text style={styles.title}>Mijn puntenstand</Text>
        <Text >Toon dit scherm aan de barman om je beloning te ontvangen</Text>
        <SecondaryButton style={{marginTop:8}} onPress={()=>setScreen(``)} label={`Terug`} />
        <Text style={styles.rewardLine}>{`${chosenReward.title} - ${chosenReward.amount.toString()}`}</Text>
        <View style={{alignSelf:'center'}}>
          <QRCode  size={280} value={`${chosenReward.uid}/f/${user.uid}`} backgroundColor='transparent' color={Colors[colorScheme].text}/> 
        </View>
      </View>
      );
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Mijn puntenstand</Text>
          <Text >Jouw huidige positie</Text>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreWrapper}><View style={[styles.scoreBar, {width: `${percentage}%`}]}></View></View>
            <View style={styles.scoreLabels}><Text>0</Text><Text style={[styles.currentScore, percentage>50?{ right: `${100-percentage}%`}:{left: `${percentage}%`}]}>{score}</Text><Text>{max}</Text></View>
          </View>
          <Text>Beloningen</Text>
          <FlatList
            style={styles.rewardsList}
            data={rewards.sort((first, second)=>first.amount-second.amount)}
            extraData={score}
            renderItem={({item, index}) => <Reward reward={item} />}
            showsVerticalScrollIndicator ={false}
            showsHorizontalScrollIndicator={false} 
            keyExtractor={(item, index) => index.toString()} 
            />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'flex-start',
    padding:16,
    width:'100%'
  },  
  separator: {
    marginVertical: 8,
    width:'85%',
    height: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom:8,
  },
  settings:{
    marginTop:24,
    flexShrink:1,
    alignItems:'center',
    width:"100%",
  },
  profileItem: {
    flexShrink:1,
    width:'95%',
    flexDirection:'row',
    alignItems:'center',
  },
  profileItemTitle:{
    fontWeight: '600',
    marginLeft:16,
    flexGrow:1,
  },
  scoreContainer:{
    width:'100%',
    marginVertical:16,
  },
  scoreWrapper:{
    backgroundColor: secondaryGrey,
    height:16,
    width:'100%',
  },
  scoreBar:{
    backgroundColor: primaryGrey,
    height:16,
  },
  scoreLabels:{
    flexShrink:1,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'flex-start',
    width:'100%',
    position:'relative',
  },
  currentScore:{
    position: 'absolute',
    top: 16,
    textAlign:'center',
    fontWeight:'600',
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
  exchangeButton:{
    alignSelf: 'flex-end'
  },
  rewardLine: {
    fontWeight:'600',
    fontSize:18,
    marginVertical:16,

  }
});
