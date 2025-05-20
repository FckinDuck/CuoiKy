import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../utils/theme';

const DetailScreen = ({ route }) => {
  const { foodId } = route.params;
  const food = {
    id: foodId,
    name: 'Bún bò Huế',
    image: 'https://picsum.photos/200',
    description: 'Món ăn đặc trưng Huế...',
    restaurant: 'Quán Cô Ba',
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: food.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{food.name}</Text>
        <Text style={styles.subtitle}>Nhà hàng: {food.restaurant}</Text>
        <Text style={styles.description}>{food.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  image: { width: '100%', height: 240 },
  info: { padding: SPACING.md },
  title: { fontSize: FONT_SIZES.xl, fontWeight: 'bold' },
  subtitle: { fontSize: FONT_SIZES.medium, color: COLORS.subText },
  description: { fontSize: FONT_SIZES.medium, marginTop: SPACING.sm },
});

export default DetailScreen;
