import React , { useState, useEffect } from 'react';
import { StyleSheet , FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Text, View } from '../components/Themed';


export default function HomeScreen() {
  interface drinks  {
    objects: Array<object>;
  }
  const [ drinks, setDrinks] = useState([]);

  useEffect(() => {
    async function fetchDrinks() {
      try {
        const ref = await firestore().collection('drinks').get();
        const arr = ref.docs;
        arr.map(item => item.data)
        setDrinks(arr);
      } catch (err) {
        console.error(err);
      }
    }

    fetchDrinks();
  }, [drinks]);

  return (
    <View style={styles.container}>
      <FlatList
        data={drinks}
        renderItem={({item}) => <Text style={styles.title}>{item.get('title')}</Text>}
      />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

