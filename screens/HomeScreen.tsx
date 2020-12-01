import React , { useState, useEffect } from 'react';
import { StyleSheet , ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Text, View, FlatList } from '../components/Themed';
import Post from '../components/Post';
import { primaryGrey } from '../constants/Colors';


export default function HomeScreen({navigation}:{navigation: any}) {
  type posts  = any[];
  const [ posts, setPosts] = useState([]);
  const [ isFetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      if(isFetching){
        try {
          const ref = await firestore().collection('posts').get();
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
        contentContainerStyle={{flexGrow: 1,  alignItems: 'center', justifyContent:'flex-start', alignSelf: 'stretch'}}
        data={posts}
        renderItem={(item) => {
          return <Post post={item} />;
        }}
        style={styles.container}     
        showsVerticalScrollIndicator ={false}
        showsHorizontalScrollIndicator={false} 
        refreshing={isFetching}
        onRefresh={()=>setFetching(true)}
        keyExtractor={item => item.index}
        />

  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  }
});

