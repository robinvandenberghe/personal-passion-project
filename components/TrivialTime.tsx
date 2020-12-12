import React, {useState, useEffect} from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View, InputWithLabel, PrimaryButton, SecondaryButton } from './Themed';
import { useGlobalState } from '../state';
import AppIcons from './AppIcons';
import { errorDark, successDark } from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { SERVER_URL, APP_API } from '@env';
import useInterval from './../hooks/useInterval';

export default function TrivialTime({starter = false, socket}:{starter?:boolean;socket:any;}) {
  const [error, setError] = useState<{subject:string; message:string;}|undefined>();
  const [code, setCode] = useState<string>(``);
  const [ answerValue, setAnswerValue ] = useState<string>(``);
  const [ turn, setTurn ] = useState<{round:number; id:number; seconds:number; question:string; answerPossibilities: string[]; }>();
  const [ screen, setScreen ] = useState<string>(``);
  const [ seconds, setSeconds ] = useState<number>(null);
  const [ user, setUser ] = useGlobalState('user');
  const [ activateTimer, setActivateTimer ] = useState<boolean>(false);
  const [ gameUser, setGameUser ] = useState({id: user.uid, imgUri: user.profileImg, name: `${user.name} ${user.surname.charAt(0)}.`, score:0 });
  const [ game, setGame ] = useState<{ type: string; code: string; users: { imgUri: string; id: string; name: string; score: number; }[]; rounds: any[]; started: boolean; }>();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const handleGuessAnswer = () => {
    if(socket){
      const isCorrect = turn.answerPossibilities.includes(slugify(answerValue));
      socket.emit('answerGuessedTrivialTime', { turn, isCorrect, timeLeft:seconds });
      if(isCorrect){
        setScreen(`turnCorrect`);
        setSeconds(null);
        setAnswerValue(``);
      }else{
        setScreen(`turnWrong`);
        setSeconds(null);
        setAnswerValue(``);
      }
    }
  }

  const timerCallback = () => {
    socket.emit('answerGuessedTrivialTime', { turn, isCorrect: false, timeLeft:0 });
    setScreen(`turnWrong`);
    setSeconds(null);
    setAnswerValue(``);
  }

  useEffect(()=>{
    const run = async () => {
      if(starter && !game){
        const nGame = {type: 'trivial-time', code: makeId(6), users: [gameUser], rounds: [], started:false};
        socket.emit('newGameTrivialTime', nGame);
        setGame(nGame);
        setScreen(`newGame`);
      }
    };
    run();

    socket.on('turnEnded', () =>{
      setScreen(`turnEnded`);
    }); 

    socket.on('turn', (turn) =>{
        setTurn(turn);
        setSeconds(turn.seconds);
        setScreen(`yourTurn`);
    });

    socket.on('roundEnded', (game) =>{
      setGame({...game});
      setScreen(`roundEnded`);
    });
  
    socket.on('gameUpdated', (game) =>{
      const r = game.users.find(u => u.id == gameUser.id);
      if(r && screen == ``){
        setGame(game);
        setScreen(`newGame`);
      }else{
        setGame(game);
      }
    });
    
    socket.on('gameError', err =>{
      setError(err);
    });
    
  },[activateTimer]);

  switch(screen){
    case `roundEnded`:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Het zit erop</Text>
          <Text>Iedereen kwam aan de beurt. Hieronder kun je de huidige stand zien, je kunt ervoor kiezen om te stoppen of verder te spelen</Text>
          <Text style={styles.subtext}>Huidige tussenstand:</Text>
          {game.users.sort((a,b)=>b.score-a.score).slice(0,5).map((user, index) => {
            return <View key={index} style={styles.scoreLine}><Text style={{fontWeight:'600', fontSize: (1-(index/5))*16+16}}>{`${(index+1)}. ${user.name}`}</Text><Text style={{fontWeight:'600', fontSize: (1-(index/5))*16+16}}>{user.score.toString()}</Text></View>;
          })}
          {starter?<PrimaryButton style={styles.gameButton} onPress={()=>{if(socket)socket.emit('newRoundTrivialTime', game.code)}} label={`Nog een rondje!`}/>:null}
          <SecondaryButton style={styles.gameButton} onPress={()=>navigation.goBack()} label={`Stoppen`}/>
        </View>
      );
    case `yourTurn`:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Tijd voor een vraag!</Text>
          <Text>Probeer zo snel mogelijk het juiste antwoord in te vullen.</Text>
          <Timer time={seconds} callback={timerCallback} setTime={setSeconds}/>
          <Text style={styles.subtext}>De vraag</Text>
          <Text style={{fontSize:18}}>{turn.question}</Text>
          <InputWithLabel style={styles.input} placeholder="..." label="Jouw antwoord" isError={(error && error.subject) == 'answer'?true: false}  errMessage={(error && error.subject) == 'answer'?error.message: ''} value={answerValue} callback={(val)=>{if(val!==''&&error&&error.subject=='answer'){setError(null)}; setAnswerValue(val);}} />
          <PrimaryButton style={styles.gameButton} onPress={handleGuessAnswer} label={`Antwoorden`}/>
        </View>
      );
    case `turnCorrect`:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{`Helemaal juist!`}</Text>
          <Text>{`Wacht nog even tot iedereen heeft kunnen antwoorden.`}</Text>
          <View style={styles.iconWrapper}>
            <AppIcons size={160} name={`success`} color={successDark} />
          </View>
        </View>
      );
    case `turnWrong`:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{`Helaas!`}</Text>
          <Text>{`Je had het mis, wacht nog even tot iedereen heeft kunnen antwoorden en ontdek het correcte antwoord.`}</Text>
          <View style={styles.iconWrapper}>
            <AppIcons size={160} name={`error`} color={errorDark} />
          </View>
        </View>
      );
    case `turnEnded`:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{`Iedereen heeft geantwoord`}</Text>
          <Text>{`Het juiste antwoord was: ${makeTitle(turn.answerPossibilities[0])}`}</Text>
          {starter?<><View style={styles.spacer}/><PrimaryButton style={styles.gameButton} onPress={()=>{if(socket)socket.emit('nextTurn', turn)}} disabled={game.users.length>1?false:true}  label={`Volgende`}/></>:null}
        </View>
      );
    case `newGame`:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Wachten op andere spelers</Text>
          <Text>Geef je spelcode door zodat anderen kunnen deelnemen aan jouw spel.</Text>
          <View style={styles.centeredContainer}>
            <Text style={styles.subtext}>Jouw spelcode</Text>
            <Text style={styles.gameCode}>{game.code}</Text>
            <Text style={styles.subtext}>Aangesloten spelers</Text>
            <View style={styles.connectedUsers}>
              {game.users.map((user, index) => <View key={index} style={{alignItems:'center'}}><Image style={styles.profileImg} source={{uri: `${SERVER_URL}assets/img/users/${user.imgUri}`, headers: { 'Authorization' : `Bearer ${APP_API}`}}} /><Text style={styles.connectedUserText}>{user.name}</Text></View>)}
            </View>
          </View>
          {starter?<><View style={styles.spacer}/><PrimaryButton style={styles.gameButton} onPress={()=>{if(socket)socket.emit('startGameTrivialTime', game.code)}} disabled={game.users.length>1?false:true}  label={`Starten`}/></>:null}
        </View>
      );
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Geef een spelcode in</Text>
          <Text>Geef een spelcode in om deel te nemen aan iemands spel.</Text>
          <InputWithLabel style={styles.input} placeholder="bv. 6EFF9O3" label="Geef een spelcode in" isError={(error && error.subject) == 'code'?true: false}  errMessage={(error && error.subject) == 'code'?error.message: ''} value={code} callback={(val)=>{if(val!==''&&error&&error.subject=='code'){setError(null)}; setCode(val);}} />
          <PrimaryButton style={styles.gameButton} onPress={()=>{if(socket)socket.emit('gameJoinRequestTrivialTime',{code, gameUser})}} label={`Doorgaan`}/>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  centeredContainer:{
    flexShrink:1,
    alignItems:'center',
    marginTop:24,
    width:'100%',
  },
  subtext:{
    fontSize:18,
    fontWeight:'600',
    marginTop:8,
  },
  gameCode:{
    fontSize:40,
    fontWeight:'700',
    alignSelf:'center',
    flexWrap: "wrap",
  },
  connectedUsers:{
    flexGrow:1,
    justifyContent:'space-between',
    flexDirection:'row',
    flexWrap:'wrap',
    width:'100%',
    marginVertical:8,
  },
  connectedUserText:{
    marginHorizontal: 8,
  },
  iconWrapper:{
    alignSelf:'center',
    marginTop: 48,
  },
  scoreLine:{
    flexShrink:1,
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileImg:{
    width:40,
    height:40,
    resizeMode:'cover',
    borderRadius:20,
  }

});

const makeId = (length) => {
  let result= '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const makeTitle = (slug) => {
  var words = slug.split('-');
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }
  return words.join(' ');
}

const slugify = (text) =>  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')

const Timer = ({time, callback,setTime}:{time:number; callback:any;setTime:any;}) => {
  const x = useInterval(()=>{
    if(time <= 0){
      clearInterval(x);
      callback();
    }else {
      const newVal = time-1;
      setTime(newVal);
    }
  },1000);

  return <Text style={styles.gameCode}>{`00:${("0" + time.toString()).slice(-2)}`}</Text>;
}