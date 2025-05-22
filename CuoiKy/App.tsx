import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './providers/AuthProvider';
import AppNavigator from './navigation/AppNavigator';
import { MenuProvider } from 'react-native-popup-menu';
// testcommit
const App = () => {
  return (
    <MenuProvider>
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
    </MenuProvider>
  );
};

export default App;
