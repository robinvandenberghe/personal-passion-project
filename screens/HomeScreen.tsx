import React , { useState, useEffect } from 'react';
import { StyleSheet , ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Text, View, FlatList } from '../components/Themed';
import Post from '../components/Post';
import { primaryGrey } from '../constants/Colors';


export default function HomeScreen({navigation}:{navigation: any}) {
  type posts  = any[];
  const [ posts, setPosts] = useState([]);
  useEffect(() => {
    async function fetchPosts() {
      try {
        const ref = await firestore().collection('posts').get();
        const arr = ref.docs.map(item => item.data());
        setPosts(arr);
      } catch (err) {
        console.error(err);
      }
    }
    fetchPosts();
  }, [posts, setPosts]);

  return (
      <FlatList
        contentContainerStyle={{flexGrow: 1,  alignItems: 'center', justifyContent:'flex-start'}}
        data={posts}
        renderItem={(item) => {
          return <Post post={item} />;
        }}
        style={styles.container}     
        showsVerticalScrollIndicator ={false}
        showsHorizontalScrollIndicator={false} 
        keyExtractor={item => item.index}/>

  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  }
});

