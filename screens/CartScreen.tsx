import React, {useState} from 'react';
import { StyleSheet, Image, Pressable, TextInput } from 'react-native';
import Colors, { errorDark, secondaryLight ,primaryCrema , primaryDark, primaryLight} from '../constants/Colors';
import QRCode from 'react-native-qrcode-svg';
import useColorScheme from '../hooks/useColorScheme';
import { Text, View , FlatList} from '../components/Themed';
import AppIcons from '../components/AppIcons';
import { cartType, drinksType} from '../types';
import { useGlobalState } from '../state';
import { parse } from 'react-native-svg';


export default function CartScreen() {
  const [screen, setScreen] = useState<string>('');
  const colorScheme = useColorScheme();
  const [cart, setCart] = useGlobalState('cart');


  const deleteItem = (item:any) => {
    cart.splice(cart.indexOf(item),1);
    setCart([...cart]);
  }


  switch(screen){
    case `qsdfqsdf`:
      return null;
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Jouw bestelling</Text>
          <FlatList
            data={cart}
            renderItem={({item}) => <Drink item={item} deleteItem={deleteItem}/>}
            showsVerticalScrollIndicator ={false}
            showsHorizontalScrollIndicator={false} 
            keyExtractor={(item, index) => index.toString()} 
            />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    position:'relative',
    flexGrow:1,
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
  title: {
    fontWeight:'500',
    fontSize: 24,
    marginBottom:16,
  },
  drinkTitle : {
    marginLeft:8,
    justifyContent:'center',
    alignItems:'center',
    flexGrow:1,
  },
  drinkImage : {
    width: 40,
    height:40,
    resizeMode:'contain',
  },
  amountInput:{
    fontSize: 16,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign:'center',
    color: primaryDark,
    borderColor: primaryCrema,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: primaryLight,
    width:40,
    marginLeft:8,
  },
  deleteButton:{
    backgroundColor: errorDark,
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

const Drink = ({item, deleteItem}:{item:cartType; deleteItem:any;}) => {
  const [imgLink, setImgLink] = useState(require('./../assets/images/drinkDefault.jpg'));
  const [amount, setAmount] = useState(item.amount);
  const [cart, setCart] = useGlobalState('cart');

  return (
    <View style={styles.drinkContainer}>
      <Image source={imgLink} style={styles.drinkImage}/>
      <Text style={styles.drinkTitle}>{item.drink.title}</Text>
      <Text>{`€${item.drink.price.toString().replace(`.`, `,`)}`}</Text>
      <TextInput style={styles.amountInput} keyboardType='numeric' returnKeyType='done' onEndEditing={()=>{
        cart[cart.indexOf(item)].amount = amount;
        setCart([...cart]);
        }} onChangeText={(val)=> val!=''?setAmount(parseInt(val)):setAmount(0)} value={amount.toString()}/>     
      <Pressable onPress={() => deleteItem(item)} style={styles.deleteButton}><AppIcons size={20} name={'cartcross'} color={secondaryLight} /></Pressable>
    </View>
  );
}
