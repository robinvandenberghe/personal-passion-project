import React, {useState} from 'react';
import { StyleSheet, Image, Pressable, TextInput } from 'react-native';
import Colors, { errorDark, secondaryLight ,primaryCrema , primaryDark, primaryLight} from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { Text, View , FlatList, PrimaryButton, SecondaryButton, ScrollView, InputWithLabel} from '../components/Themed';
import AppIcons from '../components/AppIcons';
import { cartType} from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import { useGlobalState } from '../state';


export default function CartScreen() {
  const [screen, setScreen] = useState<string>('');
  const colorScheme = useColorScheme();
  const [cart, setCart] = useGlobalState('cart');
  const [user, setUser] = useGlobalState('user');

  const [tableNumber, setTableNumber] = useState<string>('');
  let cartTotal:number = 0;
  cart.map((item)=> cartTotal += (item.amount * item.drink.price));
  const insets = useSafeAreaInsets();


  const deleteItem = (item:any) => {
    cart.splice(cart.indexOf(item),1);
    setCart([...cart]);
  }

  const handleOrderWithoutPayment = async () =>{
    const order = {
      date: firestore.Timestamp.now(),
      drinks : {},
      paid: false,
      ready: false,
      tableNumber,
      userId: user.uid,
    };
  }

  switch(screen){
    case `checkout`:
      return (
        <View style={[styles.container]} >
          <Text style={styles.title}>Jouw bestelling</Text>
          <FlatList
            data={cart}
            renderItem={({item}) => <Drink item={item} deleteItem={deleteItem} screen={screen}/>}
            showsVerticalScrollIndicator ={false}
            showsHorizontalScrollIndicator={false} 
            keyExtractor={(item, index) => index.toString()} 
            contentContainerStyle={[{flexShrink:1}]}
            nestedScrollEnabled={true}
            />
          <View style={styles.totalLine}>
            <Text style={[{fontWeight:'600', fontSize:18}]}>Totaal</Text> 
            <Text style={[{fontWeight:'600', marginLeft:8, fontSize:18}]}>{`€${cartTotal.toString().replace(`.`, `,`)}`}</Text> 
          </View>
          <InputWithLabel style={styles.input} placeholder="bv. 16" label="tafelnummer" value={tableNumber} callback={setTableNumber} keyboardType={"number-pad"}/>
          <View style={styles.spacer}/>
          <View style={styles.buttonStack}>
            <PrimaryButton style={styles.buttonStackButton} onPress={handleOrderWithoutPayment} label={`Betaal aan de bar`}/>
            <PrimaryButton style={styles.buttonStackButton} onPress={()=>{}} label={`Betaal via Payconiq`}/>
          </View>
          <View style={styles.buttonLine}>
            <SecondaryButton onPress={()=> setScreen(``)} label={'Terug'}/>
          </View>
        </View>
      );    
    default:
      return (
        <View style={[styles.container]} >
          <Text style={styles.title}>Jouw bestelling</Text>
          <FlatList
            data={cart}
            renderItem={({item}) => <Drink item={item} deleteItem={deleteItem} screen={screen}/>}
            showsVerticalScrollIndicator ={false}
            showsHorizontalScrollIndicator={false} 
            keyExtractor={(item, index) => index.toString()}
            />
          <View style={styles.totalLine}>
            <Text style={[{fontWeight:'600', fontSize:18}]}>Totaal</Text> 
            <Text style={[{fontWeight:'600', marginLeft:8, fontSize:18}]}>{`€${cartTotal.toString().replace(`.`, `,`)}`}</Text> 
          </View>
          <View style={styles.spacer}/>
          <View style={styles.buttonLine}>
            <SecondaryButton disabled={cart.length==0?true:false} onPress={()=> setCart([])} label={'Leegmaken'}/>
            <PrimaryButton onPress={()=> setScreen(`checkout`)} style={[{marginLeft:8}]} disabled={cart.length==0?true:false} label={'Bestellen'}/>
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    position:'relative',
    flexGrow:1,
    maxHeight:'100%',
  },
  spacer:{
    width:'100%',
    flexGrow:112,
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
  },
  buttonText:{
    fontSize:18,
    fontWeight:'600',
  },
  buttonLine:{
    flexGrow:1,
    alignSelf:'center',
    flexDirection:'row',
  },
  buttonStack:{
    flexShrink:1,
    alignSelf:'center',
    alignItems:'center',
    marginBottom: 16,
  },
  buttonStackButton:{
    alignSelf: "auto",
    marginVertical: 4,
  },
  totalLine:{
    flexGrow:1,
    alignSelf:'flex-end',
    flexDirection:'row',
    marginVertical:8,
  },
  input: {
    marginVertical: 4,
  },
});

const Drink = ({item, deleteItem, screen}:{item:cartType; deleteItem:any; screen:string;}) => {
  const [imgLink, setImgLink] = useState({uri: `https://robinvandenb.be/assets/img/kalfapp/${item.drink.imageUrl}`});
  const [amount, setAmount] = useState(item.amount);
  const [cart, setCart] = useGlobalState('cart');

  return (
    <View style={styles.drinkContainer}>
      <Image source={imgLink} style={styles.drinkImage}/>
      <Text style={styles.drinkTitle}>{item.drink.title}</Text>
      <Text>{`€${item.drink.price.toString().replace(`.`, `,`)}`}</Text>
      {screen==`checkout`? <>
        <Text style={[{marginHorizontal:8}]}>{`x${amount}`}</Text>
        <Text style={[{fontWeight:'600', flexShrink:1}]}>{`€${(amount*item.drink.price).toString().replace(`.`, `,`)}`}</Text>

      </> : <>
        <TextInput style={styles.amountInput} keyboardType='numeric' returnKeyType='done' onEndEditing={()=>{
          cart[cart.indexOf(item)].amount = amount;
          setCart([...cart]);
          }} onChangeText={(val)=> val!=''?setAmount(parseInt(val)):setAmount(0)} value={amount.toString()}/>     
        <Pressable onPress={() => deleteItem(item)} style={styles.deleteButton}><AppIcons size={20} name={'cartcross'} color={secondaryLight} /></Pressable>
      </>}
    </View>
  );
}
