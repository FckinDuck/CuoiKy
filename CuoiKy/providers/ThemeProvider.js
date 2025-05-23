import React, { createContext, useContext, useState, useEffect } from 'react';
import  {themes}  from '../utils/theme';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');
  const [theme, setTheme] = useState(themes.light);

  useEffect(() => {
    const loadTheme = async () => {
      const user = auth().currentUser;
      if (user) {
        const doc = await firestore().collection('USERS').doc(user.email).get();
        const userTheme = doc.data()?.theme || 'light';
        setThemeMode(userTheme);
        setTheme(themes[userTheme]);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    setTheme(themes[newTheme]);

    const user = auth().currentUser;
    if (user) {
      await firestore().collection('USERS').doc(user.email).update({
        theme: newTheme,
      });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
