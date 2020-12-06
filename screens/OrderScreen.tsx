import React , { useState, useEffect } from 'react';
import { StyleSheet , Image, Pressable, Dimensions} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Text, View, FlatList } from '../components/Themed';
import { useLinkTo } from '@react-navigation/native';
import AppIcons from '../components/AppIcons';
import Colors, { infoDark, primaryDark, secondaryLight, successDark } from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Draggable from 'react-native-draggable';
import { cartType, drinksType} from '../types';
import { useGlobalState } from '../state';


export default function OrderScreen() {
  const [ drinks , setDrinks] = useState<drinksType[]>([]);
  const [ isFetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const insets = useSafeAreaInsets();
  const [cart, setCart] = useGlobalState('cart');
  const [user, setUser] = useGlobalState('user');

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

  const addItem = (drink:any) => {
    if(cart.length>0){
      const r = cart.filter((a:any) => a.drink.title === drink.title);
      if(r.length == 1){
        cart[cart.indexOf(r[0])].amount +=1;
        setCart([...cart]);
      }else{
        setCart([...cart, {amount:1, drink}]);
      }
    }else{
      setCart([{amount: 1, drink}]);
    }
  }

  useEffect(() => {
    async function fetchDrinks() {
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
    fetchDrinks();
  }, [isFetching]);

  return (
    <View style={[styles.container, {paddingBottom: (insets.bottom) }]} >
      <Text style={styles.welcomeMessage}>{welcomeMessage}</Text>
      <Text>Waar heb je zin in?</Text>
      <FlatList
        style={styles.drinkList}
        data={categories}
        extraData={cart}
        renderItem={({item, index}) => <Category category={item}  drinks={drinks} index={index} cart={cart} addItem={addItem}/>}
        showsVerticalScrollIndicator ={false}
        showsHorizontalScrollIndicator={false} 
        refreshing={isFetching}
        onRefresh={()=>setFetching(true)}
        keyExtractor={(item, index) => index.toString()} 
        nestedScrollEnabled={true}
        contentContainerStyle={{paddingBottom: insets.bottom  }}
        />
      <CartIcon cart={cart} />
    </View>
    );
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

const Category = ({category, drinks, index, cart, addItem}:{category:string; drinks:drinksType[]; index:number; cart:any; addItem:any;}) => {
  const categoryDrinks:drinksType[] = drinks.filter((item)=> item.category == category);
  return (
    <>
      <Text style={styles.categoryTitle}>{category}</Text>
      <FlatList
      data={categoryDrinks}
      extraData={cart}
      renderItem={({item}) => {
        const r = cart.filter((a:any)=> a.drink.title == item.title);
        const amount = r.length ? cart[cart.indexOf(r[0])].amount | 0 : 0;
        return <Drink drink={item} amount={amount} addItem={addItem}/>
      }}
      showsVerticalScrollIndicator ={false}
      showsHorizontalScrollIndicator={false} 
      keyExtractor={(item, index) => index.toString()} 
      listKey={`${index}.1`}
      nestedScrollEnabled={true}
      />
    </>
  );
}

const Drink = ({drink, amount, addItem}:{drink:drinksType; amount:number; addItem:any; }) => {
  const [imgLink, setImgLink] = useState({uri: `https://robinvandenb.be/assets/img/kalfapp/${drink.imageUrl}`});

  return (
    <View style={styles.drinkContainer}>
      <View>      
        <Image source={imgLink} style={styles.drinkImage}/>
        <DrinkIcon amount={amount} />
      </View>
      <Text style={styles.drinkTitle}>{drink.title}</Text>
      <Text>{`€${drink.price.toString().replace(`.`, `,`)}`}</Text>
      <Pressable onPress={() => addItem(drink)} style={styles.addButton}><AppIcons size={24} name={'cartplus'} color={secondaryLight} /></Pressable>
    </View>
  );
}

const CartIcon = ({cart}:{cart:cartType[]}) => {
  const linkTo = useLinkTo();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const {width, height} = Dimensions.get('window');

  if(cart.length>0){
    return (
      <Draggable renderSize={56} x={width-64} y={height-insets.bottom-196} minX={insets.left} minY={insets.bottom} maxX={width-insets.right-8} maxY={height-insets.bottom-140}  >
        <Pressable onPress={() => linkTo(`/cart`)}style={[{backgroundColor: Colors[colorScheme].tabBackground} ,styles.cartButton]}><View style={styles.cartBadge}><Text style={styles.cartText}>{cart.length}</Text></View><AppIcons size={32} name={'cart'} color={ Colors[colorScheme].text} /></Pressable>
      </Draggable>
    );
  }else{
    return (
      <Draggable renderSize={56} x={width-64} y={height-insets.bottom-196} minX={insets.left} minY={insets.bottom} maxX={width-insets.right-8} maxY={height-insets.bottom-140}  >
        <Pressable onPress={() => linkTo(`/cart`)}style={[{backgroundColor: Colors[colorScheme].tabBackground} ,styles.cartButton]}><AppIcons size={32} name={'cart'} color={ Colors[colorScheme].text} /></Pressable>
      </Draggable>
    );
  }

}

const DrinkIcon = ({amount}:{amount:number;}) => {
  if(amount>0){
    return <View style={styles.cartBadge}><Text style={styles.cartText}>{amount.toString()}</Text></View>;
  }else{
    return null;
  }
}

