import React from 'react';
import { NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { AuthProvider } from './providers/AuthProvider';
import AppNavigator from './navigation/AppNavigator';
import { MenuProvider } from 'react-native-popup-menu';
import { ThemeProvider as CustomThemeProvider } from './providers/ThemeProvider';

const App = () => {
  return (
    <MenuProvider>
    <CustomThemeProvider>
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
    </CustomThemeProvider>
    </MenuProvider>
  );
};

export default App;
