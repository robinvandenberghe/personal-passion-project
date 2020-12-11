import React , { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { FlatList } from '../components/Themed';
import Post from '../components/Post';

export default function HomeScreen() {
  type posts  = any[];
  const [ posts, setPosts] = useState([]);
  const [ isFetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if(isFetching){
        try {
          const ref = await firestore().collection('posts').orderBy('date','desc').get();
          const arr = ref.docs.map(item => item.data());
          setPosts(arr);
          setFetching(false);
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchPosts();
  }, [isFetching]);

  return (
      <FlatList
        contentContainerStyle={styles.container}
        data={posts}
        renderItem={(item) => {
          return <Post post={item} />;
        }}
        showsVerticalScrollIndicator ={false}
        showsHorizontalScrollIndicator={false} 
        refreshing={isFetching}
        onRefresh={()=>setFetching(true)}
        keyExtractor={(item, index) => index.toString()} 
        />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    width:'100%',
    alignItems: 'center',
    justifyContent:'flex-start',
    alignSelf: 'stretch',
  }
});

