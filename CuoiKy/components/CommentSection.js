import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Comment from './Comment';

const CommentSection = ({ foodId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    console.log('CommentSection for foodId:', foodId);
    const unsubscribe = firestore()
      .collection('COMMENT')
      .where('targetId', '==', foodId)
      .onSnapshot(snapshot => {
        if (!snapshot || !snapshot.docs) {
            setComments([]);
            return;
        }
  
            const list = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
            setComments(list);
        });
    

    return () => unsubscribe();
  }, [foodId]);

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Comment comment={item} />}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có bình luận nào</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
});

export default CommentSection;
