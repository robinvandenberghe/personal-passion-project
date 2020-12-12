import React , { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { FlatList, View } from '../components/Themed';
import Post from '../components/Post';

export default function HomeScreen() {
  type posts  = any[];
  const [ posts, setPosts] = useState([]);
  const [ isFetching, setFetching] = useState(true);
  const [ fetchMore, setFetchMore] = useState(false);
  const [ limit, setLimit ] = useState(8);
  const [ lastVisible, setLastVisible ] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if(isFetching){
        try {
          const ref = await firestore().collection('posts').orderBy('date','desc').limit(limit).get();
          const arr = ref.docs.map(item => {
            const temp = item.data();
            return {uid: item.id, ...temp};
          });
          setLastVisible(ref.docs[ref.size-1]);
          setPosts(arr);
          setFetching(false);
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchPosts();
    const fetchMore = async () => {
      if(fetchMore){
        try {
          const ref = await firestore().collection('posts').orderBy('date','desc').startAfter(lastVisible).limit(limit).get();
          if(ref.size>0){
            const arr = ref.docs.map(item => {
              const temp = item.data();
              return {uid: item.id, ...temp};
            });
            const newArr = [...posts, ...arr];
            setLastVisible(ref.docs[ref.size-1]);
            setPosts(newArr);
            setFetchMore(false);
          }else{
            setFetchMore(false);
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchMore();
  }, [isFetching, fetchMore]);

  return (
    <View>
      <FlatList
        contentContainerStyle={styles.container}
        data={posts}
        renderItem={({item, index}) => {
          return <Post post={item} index={index} posts={posts} setPosts={setPosts} />;
        }}
        showsVerticalScrollIndicator ={false}
        refreshing={isFetching}
        onRefresh={()=>setFetching(true)}
        keyExtractor={(item, index) => index.toString()} 
        onEndReached={()=>setFetchMore(true)}
        onEndReachedThreshold={0}
        scrollEnabled
        />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width:'100%',
    marginBottom:8,
  }
});

