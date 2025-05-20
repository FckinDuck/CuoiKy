import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, RADIUS } from '../utils/theme';

const FoodCard = ({ food, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: food.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{food.name}</Text>
        <Text style={styles.subtitle}>{food.category}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    marginVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
  },
  info: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.subText,
  },
});

export default FoodCard;
