import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { PrimaryButton, SecondaryButton, Text, View, InputWithLabel, Message } from '../components/Themed';
import TrivialTime from '../components/TrivialTime';
import { io } from 'socket.io-client';
import firestore from '@react-native-firebase/firestore';
import { useGlobalState } from '../state';
import { SERVER_URL } from '@env';

export default function TrivialTimeScreen({navigation}:{navigation:any;}) {
  const [ screen, setScreen ] = useState<string>(``);
  const [ gameSocket, setGameSocket ] = useState<any>();
  const [ user, setUser ] = useGlobalState('user');
  const [ error, setError ]  = useState<{type:string; subject:string; message:string;}|undefined>();
  const [ question, setQuestion ] = useState<string>(``);
  const [ answer, setAnswer ] = useState<string>(``);
  const [ info, setInfo ] = useState<{ type:string; subject:string; message:string; }|null>();

  if(info){
    setTimeout(()=>setInfo(null), 4500);
  }

  const handleSendAnswer = async () =>{
    if(!question){
      setError({type:`noQuestionProvided`, subject:`question`, message: `Gelieve een vraag in te vullen.`});
    }
    if(!answer){
      setError({type:`noAnswerProvided`, subject:`answer`, message: `Gelieve een antwoord in te vullen.`});
    }
    const q = await firestore().collection('questions').where('quiz','==','trivial-time').get();
    if(q.size>0){
      const questions = q.docs.map(e => e.data());
      if(questions.find(a => a.question == question)){
        setError({type:`questionAlreadyExists`, subject:`question`, message: `De ingevulde vraag bestaat reeds.`});
      }
    }
    const r = await firestore().collection('questionRequests').add({question, answer, quiz: `trivial-time`, userId: user.uid});
    if(r){
      setQuestion(``);
      setAnswer(``);
      setInfo({type: `success`, subject: 'answerSent', message:'Je antwoord werd ingestuurd!'});
    }else{
      setError({type:`somethingWentWrong`, subject:`answer`, message: `Er ging iets mis tijdens het versturen van je antwoord.`});
    }
  }

  useEffect(()=>{
    const socket = io(SERVER_URL);
    socket.on('connect', ()=>{
      setGameSocket(socket);
    });
    navigation.addListener('beforeRemove', (e)=>{
      if(socket){
        socket.close();
      }
    });
  },[]);

  switch(screen){
    case `newGame`:
      return <TrivialTime starter={true} socket={gameSocket}/>;
    case `joinGame`:
      return <TrivialTime socket={gameSocket}/>;
    case `enterAnswer`:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Stuur een antwoord in</Text>
          {info && info.subject===`answerSent`? <Message type={info.type} message={info.message} /> : null}
          <Text>{`Stuur een antwoord in en wie weet gebruiken we het in de app.\nWanneer we jouw antwoord selecteren, krijg je 10 punten toegevoegd bij je puntenstand.`}</Text>
          <InputWithLabel style={[styles.input, {marginBottom:0,}]} placeholder="Hoeveel kost een pintje in 't Kalf?" label="Jouw vraag" isError={(error && error.subject) == 'question'?true: false}  errMessage={(error && error.subject) == 'question'?error.message: ''} value={question} callback={(val)=>{if(val!==''&&error&&error.subject=='question'){setError(null)}; setQuestion(val);}} />
          <InputWithLabel style={styles.input} placeholder="1 Euro" label="Het antwoord" isError={(error && error.subject) == 'answer'?true: false}  errMessage={(error && error.subject) == 'answer'?error.message: ''} value={answer} callback={(val)=>{if(val!==''&&error&&error.subject=='answer'){setError(null)}; setAnswer(val);}} />
          <PrimaryButton style={styles.gameButton} onPress={handleSendAnswer} label={`Insturen`}/>
          <View style={styles.spacer}/>
          <SecondaryButton style={styles.gameButton} onPress={()=>setScreen(``)} label={`Terug`}/>
        </View>
      );
    default: 
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Trivial Time</Text>
          <Text>{`Alle spelers krijgen op hetzelfde moment een vraag te zien, hoe sneller je het juiste antwoord geeft, hoe hoger je score.\n\nMaar antwoord snel, want voor je ‘t weet is de tijd om.`}</Text>
          <PrimaryButton style={[styles.gameButton, {marginTop: 24}]} onPress={()=>{if(gameSocket)setScreen(`newGame`)}} label={`Start een nieuw spel`}/>
          <SecondaryButton style={styles.gameButton} onPress={()=>{if(gameSocket)setScreen(`joinGame`)}} label={`Geef een spelcode in`} />
          <View style={styles.spacer}/>
          <View style={styles.answerView}>
            <PrimaryButton style={{alignSelf:'center', marginBottom:8}} onPress={()=>setScreen(`enterAnswer`)} label={`Stuur een antwoord in`} />
            <Text style={{fontSize:14}}>{`Stuur een antwoord in en wie weet gebruiken we het in de app.\nWanneer we jouw antwoord selecteren, krijg je 10 punten toegevoegd bij je puntenstand.`}</Text>
          </View>
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
});
