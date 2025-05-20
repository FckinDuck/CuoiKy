import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../utils/theme';

const SettingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chế độ nền tối</Text>
      <Switch />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.large,
    color: COLORS.text,
  },
});

export default SettingScreen;
