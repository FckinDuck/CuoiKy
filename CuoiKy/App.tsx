import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './providers/AuthProvider';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
