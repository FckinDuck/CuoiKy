import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../providers/AuthProvider';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/theme';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !displayName || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await register(email, password, displayName);
      Alert.alert('Thành công', 'Tạo tài khoản thành công', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo tài khoản</Text>

      <TextInput
        placeholder="Tên hiển thị"
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.input}
        autoCapitalize="words"
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#999"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: SPACING.lg }} />
      ) : (
        <>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Đăng ký</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Đã có tài khoản? Đăng nhập</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: FONT_SIZES.xLarge || 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.lg,
    color: COLORS.text || '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: RADIUS.md || 10,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: FONT_SIZES.medium || 16,
    color: COLORS.text || '#333',
  },
  error: {
    color: COLORS.error || 'red',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: COLORS.primary || '#007BFF',
    borderRadius: RADIUS.md || 10,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: FONT_SIZES.medium || 16,
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    color: COLORS.subText || '#666',
    fontSize: FONT_SIZES.small || 14,
    textDecorationLine: 'underline',
  },
});
