import React, { useEffect, useState } from 'react';
import { View, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import FoodCard from '../components/FoodCard';
import { COLORS, SPACING } from '../utils/theme';
// Dummy
const dummyFoods = [{ id: '1', name: 'Bún bò Huế', image: 'https://picsum.photos/200', category: 'Vietnamese' }];

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={dummyFoods}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: SPACING.md }}
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

export default HomeScreen;
