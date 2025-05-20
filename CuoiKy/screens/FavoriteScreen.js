import React from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import FoodCard from '../components/FoodCard';
import { COLORS, SPACING } from '../utils/theme';

const FavoriteScreen = ({ navigation }) => {
  const favorites = []; //#tag: to be replaced with actual data source

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
            <FoodCard food={item} onPress={() => navigation.navigate('Detail', { foodId: item.id })} />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default FavoriteScreen;
