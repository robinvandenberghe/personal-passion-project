import React , { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Text, View, FlatList, PrimaryButton, Pressable, SecondaryButton} from '../components/Themed';
import { StyleSheet } from 'react-native';
import Colors, { alertDark, errorDark, infoDark, primaryDark, secondaryLight, successDark } from '../constants/Colors';
import { useGlobalState } from '../state';
import AppIcons from '../components/AppIcons';


export default function QuestionsScreen() {
  const [ screen, setScreen ] = useState<string>(``);
  const [ user, setUser ] = useGlobalState('user');
  const [ error, setError ] = useState<{type:string; subject:string; message:string;}|undefined>();
  const [ value, setValue ] = useState<string>(``);
  const [ info, setInfo ] = useState<{ type:string; subject:string; message:string; }|null>();
  const [ isFetching, setFetching] = useState(true);
  const [ questions , setQuestions] = useState<{quiz:string; questions:object[]; requestLength:number;}[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if(isFetching){
        try {
          const r = await firestore().collection("questions").orderBy("quiz", "asc").get();
          const a = r.docs.map((item) => {
            const temp = item.data();
            return {uid: item.id, ...temp};
          });
          const c:{quiz:string; questions:object[]; requestLength:number;}[] = [];
          a.map(item => {
            if(c.length==0||!c.find(q=>q.quiz == makeTitle(item.quiz))){
              c.push({quiz: makeTitle(item.quiz), questions:[], requests: []});
             }
            });
          c.map(game => game.questions = a.filter(item => makeTitle(item.quiz) == game.quiz));
          const b = await firestore().collection("questionRequests").orderBy("quiz", "asc").get();
          const req = b.docs.map((item) => {
            const temp = item.data();
            return {uid: item.id, ...temp};
          });
          c.map(game => {
            const gameRequests = req.filter(item => makeTitle(item.quiz) == game.quiz);
            game.requestLength = gameRequests.length;
            game.questions = [...gameRequests, ...game.questions];
          });
          setQuestions(c);
          setFetching(false);
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchRequests();
  }, [isFetching]);

  const Question = ({question}:{question:object;}) => {
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
        {question.userId? 
          <>
            <Pressable style={[styles.roundButton,styles.rejectButton]} onPress={()=>{handleRejection(question)}}><AppIcons size={15} color={secondaryLight} name={'cartcross'} /></Pressable>
            <Pressable style={[styles.roundButton,styles.approveButton]} onPress={()=>{handleApproval(question)}}><AppIcons size={18} color={secondaryLight} name={'approve'} /></Pressable>
          </>
        :
          <Pressable style={[styles.roundButton,styles.editButton]} onPress={()=>{}}><AppIcons size={18} color={secondaryLight} name={'posts'} /></Pressable>
        }
      </View>
    );
  }

  const handleRejection = async ({questionProposal}:{questionProposal:any;}) =>{
    const { uid} = questionProposal;
    await firestore().doc(`questionRequests/${uid}`).delete();
    setFetching(true);
  }

  const handleApproval = async (questionProposal:any) =>{
    const {question, quiz, uid, userId, answer} = questionProposal;
    const increment = firestore.FieldValue.increment(10);
    await firestore().doc(`users/${userId}`).update({points : increment});
    if(slugify(quiz)==`pictionary`){
      await firestore().collection('questions').add({quiz: slugify(quiz), question});
    }
    if(slugify(quiz)==`trivial-time`){
      await firestore().collection('questions').add({quiz: slugify(quiz), question, answer, seconds:25});
    }
    await firestore().doc(`questionRequests/${uid}`).delete();
    setFetching(true);
  }

  switch(screen){
    case `pictionary`:
      return(
        <View style={[styles.container]} >
          <Text style={styles.title}>Pictionary</Text>
          <SecondaryButton style={styles.backButton} onPress={()=>{setScreen(``)}} label={`Terug`} />
          <FlatList
          style={styles.questionsList}
          data={questions[questions.indexOf(questions.find(i=>i.quiz==makeTitle(`pictionary`)))].questions}
          renderItem={({item, index}) => <Question question={item} />}
          showsVerticalScrollIndicator ={false}
          showsHorizontalScrollIndicator={false} 
          refreshing={isFetching}
          onRefresh={()=>setFetching(true)}
          keyExtractor={(item, index) => index.toString()} 
          />
        </View>
      );
    case `trivial-time`:
      return(
        <Text>Trivial Time</Text>
      );
    default:
      return(
        <View style={[styles.container]} >
          <Text style={styles.title}>Beheer de quizvragen</Text>
          <Text>Kies een quiz om te wijzigen</Text>
          {questions.map((r, index) => <View style={styles.gameButtonWrapper} key={index}><PrimaryButton style={styles.gameButton}  onPress={()=>{setScreen(slugify(r.quiz))}} label={r.quiz} />{r.requestLength>0?<View style={styles.requestLabel}><Text style={styles.requestLabelText}>{r.requestLength}</Text></View>:null}</View>)}
        </View>
      );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:16,
    flexGrow:1,
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
  questionsList:{
    flexShrink:1,
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
});

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