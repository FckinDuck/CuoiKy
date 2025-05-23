import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { FONT_SIZES, SPACING } from '../utils/theme';
import { useTheme } from '../providers/ThemeProvider';

const SettingScreen = () => {
  const { theme, themeMode, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Chế độ nền tối</Text>
      <Switch
        value={themeMode === 'dark'}
        onValueChange={toggleTheme}
        trackColor={{ false: '#767577', true: theme.primary }}
        thumbColor={themeMode === 'dark' ? theme.primary : '#f4f3f4'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.large,
    marginBottom: SPACING.sm,
  },
});

export default SettingScreen;
