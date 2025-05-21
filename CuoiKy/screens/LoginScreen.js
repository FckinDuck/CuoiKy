import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useAuth } from '../providers/AuthProvider';

const LoginScreen = ({navigation}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Đăng nhập" onPress={() => login(email, password)} />
      <Button title="Đăng ký" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

export default LoginScreen;
