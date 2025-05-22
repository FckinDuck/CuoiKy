import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../providers/AuthProvider';
import FoodCard from '../components/FoodCard';
import { COLORS, SPACING } from '../utils/theme';
import { encode as btoa } from 'base-64';

const FavoriteScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const userId = btoa(user.email);
    const favDocRef = firestore().collection('FAVORITE').doc(userId);

    const unsubscribe = favDocRef.onSnapshot(async doc => {
      setLoading(true);

      if (doc.exists) {
        const foodIdList = doc.data()?.foodIdList || [];
        const foodIds = foodIdList.map(item => item.foodId).filter(Boolean);

        if (foodIds.length === 0) {
          setFavorites([]);
          setLoading(false);
          return;
        }

        try {
          const foodCollection = firestore().collection('FOODS');
          const foodDocs = await Promise.all(
            foodIds.map(id => foodCollection.doc(id).get())
          );

          const foods = foodDocs
            .filter(doc => doc.exists)
            .map(doc => ({ id: doc.id, ...doc.data() }));

          setFavorites(foods);
        } catch (error) {
          console.error('Error fetching favorite foods:', error);
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {favorites.length === 0 ? (
        <View style={{ padding: SPACING.md }}>
          <Text>Chưa có món ăn yêu thích nào.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FoodCard
              food={item}
              onPress={() => navigation.navigate('Detail', { foodId: item.id })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default FavoriteScreen;
