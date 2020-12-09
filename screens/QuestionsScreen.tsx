import React , { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Text, View, FlatList, Pressable} from '../components/Themed';
import { useLinkTo } from '@react-navigation/native';
import AppIcons from '../components/AppIcons';
import Colors, { infoDark, primaryDark, secondaryLight, successDark } from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Draggable from 'react-native-draggable';
import { cartType, drinksType} from '../types';
import { useGlobalState } from '../state';


export default function QuestionsScreen() {
  const [ screen, setScreen ] = useState<string>(``);
  const [ user, setUser ] = useGlobalState('user');
  const [ error, setError ] = useState<{type:string; subject:string; message:string;}|undefined>();
  const [ value, setValue ] = useState<string>(``);
  const [ info, setInfo ] = useState<{ type:string; subject:string; message:string; }|null>();
  const [ isFetching, setFetching] = useState(true);
  const [ requests , setRequests] = useState<{quiz:string; requests: {userId:string; question:string;}[]}[]>([]);

  useEffect(() => {
    async function fetchRequests() {
      if(isFetching){
        try {
          const r = await firestore().collection("questionRequests").orderBy("quiz", "asc").get();
          const a = r.docs.map((item) => item.data());
          const b = a.filter(item=>item.quiz)
          const c:{quiz: string, requests: {userId:string; question:string;}[]}[];
          a.map(item => {
            if(c.indexOf(item.quiz)==-1){
              c.push({quiz: item.quiz, requests: []});
             }
             return {userId: item.userId, question: item.question};
            });
          c.map(game => game.requests = a.filter(item => item.quiz == game.quiz));
          setRequests(c);
          setFetching(false);
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchDrinks();
  }, [isFetching]);

  switch(screen){
    case `f`:
      return(
        <Text>Placeholder</Text>
      );
    default:
      return(
        <View style={[styles.container]} >
          <Text style={styles.title}>Beheer de quizvragen</Text>
          <Text>Kies een quiz om te wijzigen</Text>
          <Pressable onPress={()=>{setScreen(``)}}></Pressable>
        </View>
      );
  }

}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    position:'relative',
  },
  drinkList:{
    flexGrow:1,
    paddingBottom: 120,
  },
  welcomeMessage: {
    fontWeight:'500',
    fontSize: 24,
  },
  categoryTitle : {
    fontSize: 16,
    fontWeight:'500',
    textTransform: 'capitalize',
    marginTop: 12,
  },
  drinkContainer : {
    flexShrink: 1,
    marginVertical:8,
    flexDirection:'row',
    alignItems: 'center',
  },
  drinkTitle : {
    marginLeft:8,
    flexGrow:1,
  },
  drinkImage : {
    width: 40,
    height:40,
    resizeMode:'contain',
  },
  cartButton : {
    width:56,
    height:56,
    borderRadius:28,
    flexShrink: 1,
    justifyContent:'center',
    alignItems:'center',
    position:'relative',
  },
  addButton:{
    backgroundColor: successDark,
    width:40,
    height:40,
    borderRadius:20,
    flexShrink: 1,
    justifyContent:'center',
    alignItems:'center',
    alignSelf: 'flex-end',
    marginLeft: 8,
  },
  cartBadge:{
    position:'absolute',
    top: -8,
    right:0,
    flex:1,
    backgroundColor:infoDark,
    width:24,
    height:24,
    borderRadius:12,
    alignItems:'center',
    justifyContent:'center',
  },
  cartText: {
    fontSize: 14,
    textAlign:'center',
    lineHeight:20,
    fontWeight:'600',
    color: secondaryLight,
  },
});


