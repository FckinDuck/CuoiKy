import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { useAuth } from '../providers/AuthProvider';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !displayName) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      await register(email, password, displayName);
      Alert.alert('Thành công', 'Tạo tài khoản thành công');
    } catch (err) {
      Alert.alert('Lỗi đăng ký', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>
      <TextInput
        placeholder="Tên hiển thị"
        style={styles.input}
        onChangeText={setDisplayName}
        value={displayName}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        autoCapitalize="none"
        value={email}
      />
      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        onChangeText={setPassword}
        secureTextEntry
        value={password}
      />
      <Button title="Tạo tài khoản" onPress={handleRegister} />
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Đã có tài khoản? Đăng nhập
      </Text>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 8,
    fontSize: 16,
  },
  link: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center',
  },
});
