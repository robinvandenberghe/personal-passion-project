import React, {useState, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, InputWithLabel, PrimaryButton, SecondaryButton } from './Themed';
import { useGlobalState } from '../state';
import AppIcons from './AppIcons';
import Colors from './../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';

export default function Pictionary({starter = false, socket}:{starter?:boolean;socket:any;}) {
  const [error, setError] = useState<{type:string; subject:string; message:string;}|undefined>();
  const [code, setCode] = useState<string>(``);
  const [turn, setTurn] = useState();
  const [screen, setScreen] = useState(``);
  const [user, setUser] = useGlobalState('user');
  const [gameUser, setGameUser] = useState({id: user.uid, name: `${user.name} ${user.surname.charAt(0)}.`, score:0});
  const [game, setGame] = useState<{ type: string; code: string; users: { id: string; name: string; score: number; }[]; rounds: any[]; started: boolean; }>();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const handleStartTurn = () => {
    turn.startTime = new Date().getTime();
    setTurn({...turn});
    setScreen(`yourTurn_started`);
  }

  useEffect(()=>{
    const run = async () => {
      if(starter && !game){
        const nGame = {type: 'pictionary', code: makeId(6), users: [gameUser], rounds: [], started:false};
        socket.emit('newGamePictionary', nGame);
        setGame(nGame);
        setScreen(`newGame`);
      }
    };
    run();
    socket.on('turn', turn =>{
      const {userId} = turn;
      if(userId == user.uid){
        setTurn(turn);
        setScreen(`yourTurn_intro`);
      }else{
        setTurn(turn);
        setScreen(`othersTurn`);
      }
    });

    socket.on('roundEnded', game =>{
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
  },[]);

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
          {starter?<PrimaryButton style={styles.gameButton} onPress={()=>{if(socket)socket.emit('newRoundPictionary', game.code)}} label={`Nog een rondje!`}/>:null}
          <SecondaryButton style={styles.gameButton} onPress={()=>navigation.goBack()} label={`Stoppen`}/>
        </View>
      );
    case `yourTurn_intro`:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Het is jouw beurt</Text>
          <Text>Het is jouw beurt om onderstaand woord uit te beelden aan je mededeelnemers.</Text>
          <Text style={styles.subtext}>Beeld dit uit</Text>
          <Text style={styles.gameCode}>{turn.question}</Text>
          <PrimaryButton style={styles.gameButton} onPress={handleStartTurn} label={`Start de tijd!`}/>
        </View>
      );
    case `yourTurn_started`:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Het is jouw beurt</Text>
          <Text style={styles.subtext}>Beeld dit uit</Text>
          <Text style={styles.gameCode}>{turn.question}</Text>
          <Text style={styles.subtext}>Geraden door:</Text>
          {game.users.map((user, index) => {
            if(user.id !== gameUser.id){
              return <PrimaryButton key={index} style={styles.gameButton} onPress={()=>{if(socket)socket.emit('answerGuessedPictionary',{turn, correctUserId: user.id})}} label={user.name}/>;
            }else{
              return null;
            }
          })}
        </View>
      );
    case `othersTurn`:
      const currentUser = game.users.find(u => u.id == turn.userId);
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{`Het is aan ${currentUser.name}`}</Text>
          <Text>{`Nog even wachten tot het aan jou is, probeer ondertussen te raden wat ${currentUser.name} aan het uitbeelden is.`}</Text>
          <View style={styles.iconWrapper}>
            <AppIcons size={160} name={`stopwatch`} color={Colors[colorScheme].text} />
          </View>
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
              {game.users.map((user, index) => <Text style={styles.connectedUserText} key={index}>{user.name}</Text>)}
            </View>
          </View>
          {starter?<><View style={styles.spacer}/><PrimaryButton style={styles.gameButton} onPress={()=>{if(socket)socket.emit('startGamePictionary', game.code)}} disabled={game.users.length>1?false:true}  label={`Starten`}/></>:null}
        </View>
      );
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Geef een spelcode in</Text>
          <Text>Geef een spelcode in om deel te nemen aan iemands spel.</Text>
          <InputWithLabel style={styles.input} placeholder="bv. 6EFF9O3" label="Geef een spelcode in" isError={(error && error.subject) == 'code'?true: false}  errMessage={(error && error.subject) == 'code'?error.message: ''} value={code} callback={(val)=>{if(val!==''&&error&&error.subject=='code'){setError(null)}; setCode(val);}} />
          <PrimaryButton style={styles.gameButton} onPress={()=>{if(socket)socket.emit('gameJoinRequestPictionary',{code, gameUser})}} label={`Doorgaan`}/>
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