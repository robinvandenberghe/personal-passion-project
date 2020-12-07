import React , { useState, useEffect } from 'react';
import { StyleSheet , View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Text, FlatList, PrimaryButton, View as ViewWrapper } from '../components/Themed';
import Colors, { successDark } from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { orderType, drinksType} from '../types';
import { useGlobalState } from '../state';
import AppIcons from '../components/AppIcons';


export default function OrdersScreen() {
  const [ orders , setOrders] = useState<[]>([]);
  const [ isFetching, setFetching] = useState(true);
  const [drinks, setDrinks] = useGlobalState('drinks');
  const insets = useSafeAreaInsets();



  useEffect(() => {
    const fetchDrinks = async () => {
      if(isFetching){
        if(!drinks||drinks.length==0){
          try {
            const r = await firestore().collection("drinks").orderBy("title", "asc").get();
            const a:drinksType[] = r.docs.map((item) => {
              const temp = item.data();
              return {uid: item.id,category:temp.category,imageUrl:temp.imageUrl,price:temp.price,title:temp.title};
            });
            try {
              firestore().collection("orders").where('ready', '==', false).onSnapshot((querySnapshot) => {
              if(querySnapshot.size > 0){
                const b:[] = querySnapshot.docs.map((item) => {
                  const temp = item.data();
                  let tempDrinks = [];
                  for (const property in temp.drinks) {
                    const drink = a.find(item=>item.uid===property);
                    tempDrinks.push({drink, amount: temp.drinks[property]});
                  }
                  return {uid: item.id, date: temp.date.toDate(), drinks: tempDrinks, paid: temp.paid, ready: temp.ready, tableNumber: temp.tableNumber, userId: temp.userId };
                });
                b.sort((first,second)=>second.date.getTime()-first.date.getTime());
                setOrders(b);
              }
              setDrinks(a);
              setFetching(false);
              });
            } catch (err) {
              console.error(err);
            }    
          } catch (err) {
            console.error(err);
          }
        }else{
          try {
            firestore().collection("orders").where('ready', '==', false).onSnapshot((querySnapshot) => {
            if(querySnapshot.size > 0){
              const a:[] = querySnapshot.docs.map((item) => {
                const temp = item.data();
                let tempDrinks = [];
                for (const property in temp.drinks) {
                  const drink = drinks.find(item=>item.uid===property);
                  tempDrinks.push({drink, amount: temp.drinks[property]});
                }
                return {uid: item.id, date: temp.date.toDate(), drinks: tempDrinks, paid: temp.paid, ready: temp.ready, tableNumber: temp.tableNumber, userId: temp.userId };
              });
              a.sort((first,second)=>second.date.getTime()-first.date.getTime());
              setOrders(a);
            }
            setFetching(false);
            });
          } catch (err) {
            console.error(err);
          }    
        }

      }
    }
    fetchDrinks();
  }, [isFetching]);

  return (
    orders.length>0?
    <FlatList
      data={orders}
      renderItem={({item, index}) => <Order order={item}/>}
      showsVerticalScrollIndicator ={false}
      showsHorizontalScrollIndicator={false} 
      refreshing={isFetching}
      onRefresh={()=>setFetching(true)}
      keyExtractor={(item, index) => index.toString()} 
      contentContainerStyle={[{paddingBottom: insets.bottom  }, styles.container]}
      />:
      <ViewWrapper style={[{paddingTop:16, alignItems:'center'}, styles.container]}>
        <Text>Er zijn op dit moment geen bestellingen</Text>
      </ViewWrapper>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    position:'relative',
    flexGrow:1,
  },
  orderContainer:{
    marginVertical:16,
    padding: 8,
    borderRadius:8,
  },
  drinkContainer : {
    flexShrink: 1,
    marginVertical:8,
    flexDirection:'row',
    alignItems: 'center',
    backgroundColor:'transparent'
  },
  orderTime : {
    fontSize : 14,
  },
  boldText:{
    fontWeight: '600',
    fontSize:18,
  },
  splitRow:{
    flexGrow:1,
    flexDirection: 'row',
    alignItems:'flex-end',
  },
  paidMessage:{
    flexGrow:1,
    flexDirection: 'row',
    alignItems:'center',
    marginBottom:16,
    marginTop:-8,
    justifyContent: 'flex-end'
  },
  paidMessageText:{
    marginLeft: 8,
    color: successDark,
    fontSize:18,
    fontWeight:'500',
  },

});

const Order = ({order}:{order:any;}) => {
  const {date, drinks, paid, ready, tableNumber, userId} = order;
  const colorScheme = useColorScheme();
  const [oUser, setOUser] = useState();
  if(!oUser){
    firestore().doc(`users/${userId}`).get().then(d => setOUser(d.data()));
  }
  let orderTotal = 0;
  if(!paid){
    drinks.map(({drink, amount})=>orderTotal+=(drink.price*amount))
  }

  return (
    <View style={[styles.orderContainer, {backgroundColor: Colors[colorScheme].tabBackground}]}>
      <Text style={styles.orderTime}>{parsePostingTime(new Date(date))}</Text>
      <View style={[styles.splitRow, {marginVertical:16}]}>
        <View style={{flexGrow:1}}>
        {drinks.map(({drink, amount}, index) => <Text key={index}>{`${amount}x ${drink.title}`}</Text>)}
        </View>
        <Text style={styles.boldText}>{`Totaal €${orderTotal.toString()}`}</Text>
      </View>
      {paid?<View style={styles.paidMessage}><AppIcons size={18} name={`success`} color={successDark} /><Text style={styles.paidMessageText}>{`Betaald`}</Text></View>:null}
      <View style={styles.splitRow}>
        <View style={{flexGrow:1}}>
          <Text>{`Tafel ${tableNumber}`}</Text>
          <Text style={styles.boldText}>{oUser?`${oUser.name} ${oUser.surname}`:`Laden...`}</Text>
        </View>
        <PrimaryButton onPress={()=>setReady(order)} label={`Klaar`}/>
      </View>
    </View>
  );


}

const setReady = async (order:orderType) => {
  await firestore().doc(`orders/${order.uid}`).update({ready: true});
}

const parsePostingTime = (date: any) =>{
  const diff = date_diff_inminutes(date, new Date());
  if(diff == 0){
      return 'Zojuist';
  }else if(diff<=60){
    return `${diff}m geleden`;
  }else if(diff>60 && Math.round((diff/60))<24){
    return `${Math.round(diff/60)}u geleden`;
  }else{
    const displayDate = new Date(date);
    return `${displayDate.toLocaleDateString('nl-BE')} - ${displayDate.toLocaleTimeString('nl-BE', {hour: '2-digit', minute:'2-digit'})}`;
  }
}

const date_diff_inminutes = (date1: any, date2: any) => {
  const dt1 = new Date(date1);
  const dt2 = new Date(date2);
  return Math.round((dt2.getTime() - dt1.getTime()) / 1000 / 60  );
}



