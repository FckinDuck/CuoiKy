import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Avatar from '../components/Avatar';
import { COLORS, FONT_SIZES, SPACING } from '../utils/theme';
import { useAuth } from '../providers/AuthProvider';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth(); 

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.log('Logout error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Avatar uri={user?.photoURL || 'https://picsum.photos/200'} size={80} />
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
