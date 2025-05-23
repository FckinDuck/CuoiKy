import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from '../components/Avatar';
import { COLORS, FONT_SIZES, SPACING, RADIUS } from '../utils/theme';
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
      <Text style={styles.title}>Thông tin cá nhân</Text>

      <Avatar
        uri={user?.photoURL || 'https://picsum.photos/200'}
        size={100}
      />

      <Text style={styles.name}>{user?.displayName || 'Không rõ tên'}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Setting')}
        >
          <Text style={styles.buttonText}>Cài đặt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, styles.logoutText]}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xLarge || 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  name: {
    fontSize: FONT_SIZES.large,
    marginTop: SPACING.sm,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  email: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.subText,
    marginBottom: SPACING.md,
  },
  buttonContainer: {
    width: '100%',
    marginTop: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: COLORS.error || 'red',
  },
  buttonText: {
    color: '#fff',
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
  },
  logoutText: {
    color: '#fff',
  },
});
