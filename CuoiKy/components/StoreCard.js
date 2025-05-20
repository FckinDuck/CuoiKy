import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../utils/theme';

const RestaurantCard = ({ restaurant }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: restaurant.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.address}>{restaurant.address}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginVertical: SPACING.sm,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
    marginRight: SPACING.md,
  },
  info: {
    justifyContent: 'center',
  },
  name: {
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
  },
  address: {
    fontSize: FONT_SIZES.small,
    color: COLORS.subText,
  },
});

export default RestaurantCard;
