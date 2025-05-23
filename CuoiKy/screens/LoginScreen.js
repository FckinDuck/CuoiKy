import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../providers/AuthProvider';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/theme';

const LoginScreen = ({ navigation }) => {
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Vui lòng nhập email trước');
      return;
    }

    try {
      await resetPassword(email);
      Alert.alert('Thành công', 'Email đặt lại mật khẩu đã được gửi');
    } catch (err) {
      Alert.alert('Lỗi', err.message || 'Không thể gửi email đặt lại mật khẩu');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng!</Text>

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

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: SPACING.lg }} />
      ) : (
        <>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Chưa có tài khoản? Đăng ký</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

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
    marginBottom: SPACING.sm,
    fontSize: FONT_SIZES.medium || 16,
    color: COLORS.text || '#333',
  },
  forgotPasswordText: {
    textAlign: 'right',
    color: COLORS.primary || '#007BFF',
    fontSize: FONT_SIZES.small || 14,
    marginBottom: SPACING.md,
    textDecorationLine: 'underline',
  },
  error: {
    color: COLORS.error || 'red',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: COLORS.primary || '#007BFF',
    borderRadius: RADIUS.md || 10,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: FONT_SIZES.medium || 16,
    fontWeight: 'bold',
  },
  registerText: {
    textAlign: 'center',
    color: COLORS.subText || '#666',
    fontSize: FONT_SIZES.small || 14,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
