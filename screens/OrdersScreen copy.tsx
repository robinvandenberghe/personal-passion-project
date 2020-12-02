import React , { useState, useEffect } from 'react';
import { StyleSheet , Image, Pressable, Dimensions} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Text, View, FlatList } from '../components/Themed';
import { useLinkTo } from '@react-navigation/native';
import AppIcons from '../components/AppIcons';
import Colors, { primaryDark, secondaryLight, successDark } from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { useSafeAreaInsets, useSafeAreaFrame } from 'react-native-safe-area-context';
import Draggable from 'react-native-draggable';


interface drinksType {
  category:string;
  imageUrl:string;
  price:number;
  title:string;
}


export default function HomeScreen({navigation}:{navigation: any}) {
  const [ drinks , setDrinks] = useState<drinksType[]>([]);
  const [ isFetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [user, setUser] = useState(global.user);
  const insets = useSafeAreaInsets();


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
          const a:drinksType[] = r.docs.map(item => {
            const temp = item.data();
            return {category:temp.category,imageUrl:temp.imageUrl,price:temp.price,title:temp.title};
          });
          setDrinks(a);
          const c:string[] = [];
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
    <View style={[styles.container, {paddingBottom: (insets.bottom) }]} >
      <Text style={styles.welcomeMessage}>{welcomeMessage}</Text>
      <Text>Waar heb je zin in?</Text>
      <FlatList
        style={styles.drinkList}
        data={categories}
        renderItem={({item, index}) => <Category category={item}  drinks={drinks} index={index} />}
        showsVerticalScrollIndicator ={false}
        showsHorizontalScrollIndicator={false} 
        refreshing={isFetching}
        onRefresh={()=>setFetching(true)}
        keyExtractor={(item, index) => index.toString()} 
        nestedScrollEnabled={true}
        contentContainerStyle={{paddingBottom: insets.bottom  }}
        />
      <CartIcon />
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
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
  }
});

const Category = ({category, drinks, index}:{category:string; drinks:drinksType[]; index:number;}) => {
  const categoryDrinks:drinksType[] = drinks.filter((item)=> item.category == category);
  return (
    <>
      <Text style={styles.categoryTitle}>{category}</Text>
      <FlatList
      data={categoryDrinks}
      renderItem={({item}) => <Drink drink={item}/>}
      showsVerticalScrollIndicator ={false}
      showsHorizontalScrollIndicator={false} 
      keyExtractor={(item, index) => index.toString()} 
      listKey={`${index}.1`}
      nestedScrollEnabled={true}
      />
    </>
  );
}

const Drink = ({drink}:{drink:drinksType}) => {
  const [imgLink, setImgLink] = useState(require('./../assets/images/drinkDefault.jpg'));
  return (
    <View style={styles.drinkContainer}>
      <Image source={imgLink} style={styles.drinkImage}/>
      <Text style={styles.drinkTitle}>{drink.title}</Text>
      <Text>{`€${drink.price.toString().replace(`.`, `,`)}`}</Text>
      <Pressable onPress={() => alert(drink.title)} style={styles.addButton}><AppIcons size={24} name={'cartplus'} color={secondaryLight} /></Pressable>
    </View>
  );
}

const CartIcon = () =>{
  const [cart, setCart] = useState(global.cart);
  const linkTo = useLinkTo();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const {width, height} = Dimensions.get('window');

  return (
    <Draggable renderSize={56} x={width-64} y={height-insets.bottom-140} minX={insets.left} minY={insets.bottom} maxX={width-insets.right-8} maxY={height-insets.bottom-140} isCircle >
      <Pressable onPress={() => linkTo(`/cart`)}style={[{backgroundColor: Colors[colorScheme].tabBackground} ,styles.cartButton]}><AppIcons size={32} name={'cart'} color={ Colors[colorScheme].text} /></Pressable>
    </Draggable>
  );
}

const addItem = (item:drinksType) => {

}