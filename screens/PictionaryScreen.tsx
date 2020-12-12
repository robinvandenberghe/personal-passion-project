import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { PrimaryButton, SecondaryButton, Text, View, InputWithLabel, Message } from '../components/Themed';
import Pictionary from '../components/Pictionary';
import {io} from 'socket.io-client';
import firestore from '@react-native-firebase/firestore';
import { useGlobalState } from '../state';
import { SERVER_URL } from '@env';

export default function PictionaryScreen({navigation}:{navigation:any;}) {
  const [screen, setScreen] = useState<string>(``);
  const [ gameSocket, setGameSocket] = useState<any>();
  const [ user, setUser ] = useGlobalState('user');
  const [error, setError] = useState<{type:string; subject:string; message:string;}|undefined>();
  const [value, setValue] = useState<string>(``);
  const [ info, setInfo ] = useState<{ type:string; subject:string; message:string; }|null>();

  if(info){
    setTimeout(()=>setInfo(null), 4500);
  }

  const handleSendAnswer = async () =>{
    if(!value){
      setError({type:`noAnswerProvided`, subject:`answer`, message: `Gelieve een antwoord in te vullen.`});
    }
    const q = await firestore().collection('questions').where('quiz','==','pictionary').get();
    if(q.size>0){
      const questions = q.docs.map(e => e.data());
      if(questions.find(a => a.question == value)){
        setError({type:`answerAlreadyExists`, subject:`answer`, message: `Het ingevulde antwoord bestaat reeds.`});
      }
    }
    const r = await firestore().collection('questionRequests').add({question: value, quiz: `pictionary`, userId: user.uid});
    if(r){
      setValue(``);
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
      return <Pictionary starter={true} socket={gameSocket}/>;
    case `joinGame`:
        return <Pictionary socket={gameSocket}/>;
    case `enterAnswer`:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Stuur een antwoord in</Text>
          {info && info.subject===`answerSent`? <Message type={info.type} message={info.message} /> : null}
          <Text>{`Stuur een antwoord in en wie weet gebruiken we het in de app.\nWanneer we jouw antwoord selecteren, krijg je 10 punten toegevoegd bij je puntenstand.`}</Text>
          <InputWithLabel style={styles.input} placeholder="bv. Een fiets" label="Jouw voorstel" isError={(error && error.subject) == 'answer'?true: false}  errMessage={(error && error.subject) == 'answer'?error.message: ''} value={value} callback={(val)=>{if(val!==''&&error&&error.subject=='answer'){setError(null)}; setValue(val);}} />
          <PrimaryButton style={styles.gameButton} onPress={handleSendAnswer} label={`Insturen`}/>
          <View style={styles.spacer}/>
          <SecondaryButton style={styles.gameButton} onPress={()=>setScreen(``)} label={`Terug`}/>
        </View>
      );
    default: 
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Pictionary</Text>
          <Text>{`Elke speler krijgt om de beurt een voorwerp, persoon, dier, fenomeen om uit te beelden.\n\nWie het eerst juist raadt, wint. Selecteer wie juist antwoordde om de beurt door te geven.`}</Text>
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
