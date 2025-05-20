// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const dispatch = useDispatch();

  const handleRegister = async () => {
    if (!email || !password || !displayName) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName,
        photoURL: 'https://picsum.photos/200', 
      });


      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        avatar: 'https://picsum.photos/200',
        createdAt: serverTimestamp(),
      });

      dispatch(login({
        uid: user.uid,
        email: user.email,
        displayName,
        avatar: 'https://picsum.photos/200',
      }));
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
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        onChangeText={setPassword}
        secureTextEntry
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
