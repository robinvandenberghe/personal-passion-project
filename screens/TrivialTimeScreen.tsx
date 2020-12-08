import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { PrimaryButton, SecondaryButton, Text, View } from '../components/Themed';
import TrivialTime from '../components/TrivialTime';
import {io} from 'socket.io-client';


export default function TrivialTimeScreen({navigation}:{navigation:any;}) {
  const [screen, setScreen] = useState<string>(``);
  const [ gameSocket, setGameSocket] = useState<any>();

  useEffect(()=>{
    const socket = io('http://192.168.1.35');
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
    // case `enterAnswer`:
    //   return (
    //     <View style={styles.container}>
    //       <Text style={styles.title}>Trivial Time</Text>
    //       <Text>{`Alle spelers krijgen op hetzelfde moment een vraag te zien, hoe sneller je het juiste antwoord geeft, hoe hoger je score.\n\nMaar antwoord snel, want voor je ‘t weet is de tijd om.`}</Text>
    //       <PrimaryButton style={[styles.gameButton, {marginTop: 24}]} onPress={()=>{if(gameSocket)setScreen(`newGame`)}} label={`Start een nieuw spel`}/>
    //       <SecondaryButton style={styles.gameButton} onPress={()=>{if(gameSocket)setScreen(`joinGame`)}} label={`Geef een spelcode in`} />
    //       <View style={styles.spacer}/>
    //       <View style={styles.answerView}>
    //         <PrimaryButton style={{alignSelf:'center', marginBottom:8}} onPress={()=>linkTo(`/speel/nieuw-antwoord`)} label={`Stuur een antwoord in`} />
    //         <Text style={{fontSize:14}}>{`Stuur een antwoord in en wie weet gebruiken we het in de app.\nWanneer we jouw antwoord selecteren, krijg je 10 punten toegevoegd bij je puntenstand.`}</Text>
    //       </View>
    //     </View>
    //   );
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
