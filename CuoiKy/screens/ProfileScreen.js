// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Avatar from '../components/Avatar';
import { COLORS, FONT_SIZES, SPACING } from '../utils/theme';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const ProfileScreen = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (err) {
      console.log('Logout error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Avatar uri={user?.avatar || 'https://picsum.photos/200'} size={80} />
      <Text style={styles.name}>{user?.displayName || 'Không rõ tên'}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Cài đặt" onPress={() => navigation.navigate('Setting')} />
        <Button title="Đăng xuất" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  name: {
    fontSize: FONT_SIZES.large,
    marginTop: SPACING.sm,
    fontWeight: 'bold',
  },
  email: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.subText,
    marginBottom: SPACING.md,
  },
  buttonContainer: {
    width: '100%',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
});
