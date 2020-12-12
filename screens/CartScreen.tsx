import React, {useState} from 'react';
import { StyleSheet, Image, Pressable, TextInput, Linking } from 'react-native';
import Colors, { errorDark, secondaryLight ,primaryCrema , primaryDark, primaryLight, successDark} from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { Text, View , FlatList, PrimaryButton, SecondaryButton, ScrollView, InputWithLabel} from '../components/Themed';
import AppIcons from '../components/AppIcons';
import { cartType, inputErrorType} from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import { useGlobalState } from '../state';
import { PAYCONIQ_API, SERVER_URL, APP_API } from '@env';

export default function CartScreen() {
  const [screen, setScreen] = useState<string>(``);
  const colorScheme = useColorScheme();
  const [cart, setCart] = useGlobalState('cart');
  const [user, setUser] = useGlobalState('user');
  const [tableNumber, setTableNumber] = useState<string>(``);
  const [error, setError] = useState<inputErrorType | null>(null);

  let cartTotal:number = 0;
  cart.map((item)=> cartTotal += (item.amount * item.drink.price));
  const insets = useSafeAreaInsets();

  const deleteItem = (item:any) => {
    cart.splice(cart.indexOf(item),1);
    setCart([...cart]);
  }

  const handleOrder = async (payconiq:boolean) =>{
    if(tableNumber){
      const order = {
        date: firestore.Timestamp.now(),
        drinks : {},
        paid: false,
        ready: false,
        tableNumber,
        userId: user.uid,
      };
      cart.map((item) => {
        order.drinks[item.drink.uid] = item.amount;
      });
      const o = await firestore().collection('orders').add(order).catch((error)=> console.error(error));
      if(o){
        if(payconiq){
          const url = 'https://api.ext.payconiq.com/v3/payments';
          const options = { 
            method: 'POST',
            headers: {
              'Authorization' : `Bearer d2b206e2-0e2c-47f8-91bd-1c63da2cffd4`,
              'Content-Type' : 'application/json',
            },
            body: JSON.stringify({
              amount: `${cartTotal}`,
              currency: 'EUR',
              callbackUrl: `${SERVER_URL}api/payment-callback'`,
              description: `Bestelling #${o.id} JH 't Kalf`,
              reference: `${o.id}`,
            }),
          };
          fetch(url, options).then(r=>r.json()).then(response => {
            if(response){
              console.log(response);
              const { paymentId, status } = response;
              firestore().doc(`orders/${o.id}`).update({paymentId, paymentStatus:status}).then(()=>{
                const deeplink = response._links.deeplink.href;
                Linking.openURL(`${deeplink}?returnUrl=kalf-app://cart`);
                setCart([]);
                setTableNumber('');
                setScreen(`orderSuccess`);
              }).catch((err)=>{
                console.error(err);
                setScreen(`orderFailed`);
              });
            }
          }).catch((err)=>{
            console.error(err);
            setScreen(`orderFailed`);
          });

        }else{
          setCart([]);
          setTableNumber('');
          setScreen(`orderSuccess`);
        }
      }else{
        setScreen(`orderFailed`);
      }
    }else{
      setError({
        subject: 'tableNumber',
        message: 'Vul een tafelnummer in', 
      });
    }
  }

  switch(screen){
    case `orderSuccess`:
      return (
        <View style={[styles.container, styles.centerContainer]} >
          <Text style={styles.confirmTitle}>Gelukt!</Text>
          <Text style={styles.confirmSubtitle}>We ontvingen je bestelling</Text>
          <Text style={styles.confirmText}>We doen ons best om die zo snel mogelijk tot bij jou te krijgen.</Text>
          <AppIcons size={150} name={'success'} color={successDark}/>
        </View>
      );
    case `orderFailed`:
      return(
        <View style={[styles.container, styles.centerContainer]} >
          <Text style={styles.confirmTitle}>Helaas!</Text>
          <Text style={styles.confirmSubtitle}>Er liep iets mis</Text>
          <Text style={styles.confirmText}>Onze robots gingen de mist in, probeer opnieuw te bestellen.</Text>
          <AppIcons size={150} name={'error'} color={errorDark}/>
        </View>
      );
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
          <InputWithLabel style={styles.input} placeholder="bv. 16" label="tafelnummer" isError={(error && error.subject) == 'tableNumber'?true: false}  errMessage={(error && error.subject) == 'tableNumber'?error.message: ''} value={tableNumber} callback={(val)=>{if(val!==''&&error&&error.subject=='tableNumber'){setError(null)}; setTableNumber(val);}} keyboardType={"number-pad"}/>
          <View style={styles.spacer}/>
          <View style={styles.buttonStack}>
            <PrimaryButton style={styles.buttonStackButton} onPress={()=> handleOrder(false)} label={`Betaal aan de bar`}/>
            <PrimaryButton style={styles.buttonStackButton} onPress={()=> handleOrder(true)} label={`Betaal via Payconiq`}/>
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
  centerContainer:{
    alignItems:'center'
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
  confirmTitle:{
    fontWeight: '600',
    fontSize:24,
    marginBottom:8,
  },
  confirmSubtitle:{
    fontWeight: '500',
    fontSize:24,
    marginVertical:8,
  },
  confirmText:{
    marginVertical:8,
    textAlign:'center',
    maxWidth:'80%',
    marginBottom:24,
  }
});

const Drink = ({item, deleteItem, screen}:{item:cartType; deleteItem:any; screen:string;}) => {
  const [imgLink, setImgLink] = useState({uri: `${SERVER_URL}assets/img/drinks/${item.drink.imageUrl}`, headers: { 'Authorization': `Bearer ${APP_API}`}});
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
