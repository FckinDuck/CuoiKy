import React, { useEffect, useState } from 'react';
import { View, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import FoodCard from '../components/FoodCard';
import { COLORS, SPACING } from '../utils/theme';
import { useAuth } from '../providers/AuthProvider';
import { encode as btoa } from 'base-64';
import { handleLike, handleDislike } from '../utils/likeUtils';

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
              onLike={() => handleLike({ user, role: role, target: { id: food.id, type: 'food' } })}
              onDislike={() => handleDislike({ user, role: role, target: { id: food.id, type: 'food' } })} 
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
