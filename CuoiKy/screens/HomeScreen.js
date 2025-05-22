import React, { useEffect, useState } from 'react';
import { View, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import FoodCard from '../components/FoodCard';
import { COLORS, SPACING } from '../utils/theme';
import { useAuth } from '../providers/AuthProvider';
import { encode as btoa } from 'base-64';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth(); 
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('user');

  useEffect(() => {
    if (user?.email) {
      const encodedUID = btoa(user.email);
      firestore()
        .collection('USERS')
        .doc(encodedUID)
        .get()
        .then(doc => {
          if (doc.exists) {
            setRole(doc.data().role || 'user');
          }
        })
        .catch(e => console.error('Failed to get user role:', e));
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('FOODS')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          const fetchedFoods = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFoods(fetchedFoods);
          setLoading(false);
        },
        error => {
          console.error('Firestore error:', error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  const handleLike = async (food) => {
    if (!user?.email) return;

    const userId = btoa(user.email);
    const foodRef = firestore().collection('FOODS').doc(food.id);
    const likesRef = foodRef.collection('likes').doc(userId);

    const doc = await likesRef.get();
    const isLiked = doc.exists && doc.data().type === 'like';

    const fameChange = role === 'admin' ? 100 : 1;

    await firestore().runTransaction(async transaction => {
      const foodDoc = await transaction.get(foodRef);
      if (!foodDoc.exists) return;

      const currentFame = foodDoc.data().fame || 0;

      if (isLiked) {
        transaction.delete(likesRef);
        transaction.update(foodRef, { fame: currentFame - fameChange });
      } else {
        transaction.set(likesRef, { type: 'like' });
        transaction.update(foodRef, { fame: currentFame + fameChange });

        const prevDislike = await foodRef.collection('likes').doc(userId).get();
        if (prevDislike.exists && prevDislike.data().type === 'dislike') {
          transaction.delete(foodRef.collection('likes').doc(userId));
        }
      }
    });
  };

  const handleDislike = async (food) => {
    if (!user?.email) return;

    const userId = btoa(user.email);
    const foodRef = firestore().collection('FOODS').doc(food.id);
    const likesRef = foodRef.collection('likes').doc(userId);

    const doc = await likesRef.get();
    const isDisliked = doc.exists && doc.data().type === 'dislike';

    const fameChange = role === 'admin' ? 100 : 1;

    await firestore().runTransaction(async transaction => {
      const foodDoc = await transaction.get(foodRef);
      if (!foodDoc.exists) return;

      const currentFame = foodDoc.data().fame || 0;

      if (isDisliked) {
        transaction.delete(likesRef);
        transaction.update(foodRef, { fame: currentFame + fameChange });
      } else {
        transaction.set(likesRef, { type: 'dislike' });
        transaction.update(foodRef, { fame: currentFame - fameChange });

        const prevLike = await foodRef.collection('likes').doc(userId).get();
        if (prevLike.exists && prevLike.data().type === 'like') {
          transaction.delete(foodRef.collection('likes').doc(userId));
        }
      }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={foods}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: SPACING.md }}
          renderItem={({ item }) => (
            <FoodCard
              food={item}
              onPress={() => navigation.navigate('Detail', { foodId: item.id })}
              onLike={() => handleLike(item)}
              onDislike={() => handleDislike(item)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
