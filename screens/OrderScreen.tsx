import React , { useState, useEffect } from 'react';
import { StyleSheet , Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Text, View, FlatList } from '../components/Themed';
import Post from '../components/Post';
import { primaryGrey } from '../constants/Colors';


export default function HomeScreen({navigation}:{navigation: any}) {
  const [ drinks, setDrinks] = useState([]);
  const [ isFetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(global.user);
  const [cart, setCart] = useState(global.cart);

  let welcomeMessage;
  const currentHour = new Date().getHours();
  if(currentHour>=6 && currentHour<=11){
    welcomeMessage = `Goeiemorgen, ${user.name}`;
  }else if(currentHour>11 && currentHour<18){
    welcomeMessage = `Goeiemiddag, ${user.name}`;
  }else if(currentHour>=18 && currentHour<=23){
    welcomeMessage = `Goeieavond, ${user.name}`;
  }else{
    welcomeMessage = `Goeienacht, ${user.name}`;
  }

  useEffect(() => {
    async function fetchPosts() {
      if(isFetching){
        try {
          const r = await firestore().collection("drinks").orderBy("title", "asc").get();
          const a = r.docs.map(item => item.data());
          setDrinks(a);
          const c = [];
          a.map(item => {if(c.indexOf(item.category)==-1)c.push(item.category)});
          setCategories(c);
          setFetching(false);
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchPosts();
  }, [isFetching]);



  return (
    <>
    <Text>{welcomeMessage}</Text>
    <FlatList
      data={categories}
      renderItem={(category) => <Category category={category}  drinks={drinks} />}
      style={styles.container}     
      showsVerticalScrollIndicator ={false}
      showsHorizontalScrollIndicator={false} 
      refreshing={isFetching}
      onRefresh={()=>setFetching(true)}
      keyExtractor={item => item.index}
      nestedScrollEnabled={true}
      />
    </>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  categoryTitle : {
    fontSize: 14,
    fontWeight:'500',
    textTransform: 'capitalize',
    marginTop: 12,
  },
  drinkContainer : {
    flexShrink: 1,
    marginVertical:4,
    flexDirection:'row',
    alignItems: 'center',
  },
  drinkTitle : {
    marginLeft:8,
  },
  drinkImage : {
    width: 37,
    height:37,
    resizeMode:'contain',
  }
});

const Category = ({category, drinks}:{category:string; drinks:object[];}) => {
  return (
    <>
      <Text style={styles.categoryTitle}>{category.item}</Text>
      <FlatList
      data={drinks.filter((item)=> item.category == category.item)}
      renderItem={(drink) => <Drink drink={drink}/>}
      showsVerticalScrollIndicator ={false}
      showsHorizontalScrollIndicator={false} 
      keyExtractor={item => item.index}
      nestedScrollEnabled={true}

      />
    </>
  );
}

const Drink = ({ drink}:{drink:object;}) => {
  const [imgLink, setImgLink] = useState(require('./../assets/images/drinkDefault.jpg'));


  return (
    <View style={styles.drinkContainer}>
      <Image source={imgLink} style={styles.drinkImage}/>
      <Text style={styles.drinkTitle}>{drink.item.title}</Text>
    </View>
  );
}