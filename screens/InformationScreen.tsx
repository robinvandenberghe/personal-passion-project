import React , { useState } from 'react';
import { StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { View, InputWithLabel, Text, PrimaryButton, Message} from '../components/Themed';
import { useGlobalState } from '../state';

export default function LoginScreen() {
  const [ user, setUser ] = useGlobalState('user');
  const [ name, setName] = useState(user.name);
  const [ surname, setSurname] = useState(user.surname);
  const [ phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [ info, setInfo ] = useState<{ type:string; subject:string; message:string; }|null>();
  const [error, setError] = useState<{type:string; subject:string; message:string;}>();

  if(info){
    setTimeout(()=>setInfo(null), 4500);
  }

  const handleInfoChange = () => {
    if(name && surname){
      user.name = name;
      user.surname = surname;
      user.phoneNumber = phoneNumber;
      firestore().collection('users').doc(user.uid).update({name, surname, phoneNumber})
      .then(()=>{
        setUser({...user});
        setInfo({type: `success`, subject: 'userUpdated', message:'Je profiel werd bijgewerkt!'});
      })
      .catch(error => console.error(error));  
    }else{
      if(!name){
        setError({type: `noName`, subject: `name`, message: `Geef uw naam in.`});
      }
      if(!surname){
        setError({type: `noSurname`, subject: `surname`, message: `Geef uw familienaam in.`});
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mijn informatie</Text>
      <View style={styles.formContainer}>
        <Text style={styles.subText}>Persoonlijke gegevens</Text>
        {info && info.subject===`userUpdated`? <Message type={info.type} message={info.message} /> : null}
        <InputWithLabel style={styles.input} placeholder="Jan" label="voornaam" isError={(error && error.subject) == 'name'?true: false} value={name} callback={(val)=>{if(val!==''&&error&&error.subject=='name'){setError(null)}; setName(val);}} type="name" />
        <InputWithLabel style={styles.input} placeholder="Janssens" label="familienaam" isError={(error && error.subject) == 'surname'?true: false} value={surname} callback={(val)=>{if(val!==''&&error&&error.subject=='surname'){setError(null)}; setSurname(val);}} type="familyName" />
        <InputWithLabel style={styles.input} placeholder="e-mailadres" label="e-mail" value={user.email} callback={()=>{}} disabled={true} type="emailAddress" />
        <InputWithLabel style={styles.input} placeholder="telefoonnummer" label="gsm-nummer (optioneel)" isError={(error && error.subject) == 'phoneNumber'?true: false} value={phoneNumber} callback={(val)=>{if(error&&error.subject=='phoneNumber'){setError(null)}; setPhoneNumber(val);}} type="telephoneNumber" />
        <PrimaryButton style={styles.button} onPress={handleInfoChange} label={'Opslaan'}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'flex-start',
    padding:16,
    width:'100%'
  }, 
  formContainer:{
    flexShrink:1,
    width:'90%',
    alignSelf:'center',
    alignItems:'center',
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
  input: {
    marginVertical: 4,
  },
  button:{
    alignSelf: 'flex-end',
    marginVertical:4,
    marginRight:'5%',
  },
  subText:{
    fontSize:14,
    fontWeight:'600',
    alignSelf:'flex-start',
  },
});
