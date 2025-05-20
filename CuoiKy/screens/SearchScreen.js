import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES } from '../utils/theme';

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tìm kiếm món ăn / quán ăn</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  text: {
    fontSize: FONT_SIZES.large,
    color: COLORS.text,
  },
});

export default SearchScreen;
