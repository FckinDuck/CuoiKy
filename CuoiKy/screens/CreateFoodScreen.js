import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, Image, ScrollView, StyleSheet, Alert
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { firebase,database } from '@react-native-firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../providers/AuthProvider';
import { COLORS } from '../utils/theme';

const CreateFoodScreen = ({ navigation }) => {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };

  const handleCreateFood = async () => {
    if (!name || !category || !description || !price || !imageUri) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const id = `food_${uuidv4()}`;
    const createdAt = new Date().toISOString();

    const newFood = {
      id,
      name,
      category,
      description,
      image: imageUri,
      price: parseInt(price),
      rating: 0,
      fame: 0,
      shareCount: 0,
      commentCount: 0,
      createdAt,
      updatedAt: createdAt,
      restaurants: [],
      authorId: user?.uid,
      isReported: false,
    };

    try {
      await database().ref(`foods/${id}`).set(newFood);
      Alert.alert('Thành công', 'Món ăn đã được đăng');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tạo món ăn: ' + err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tạo món ăn</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên món"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Loại món (ví dụ: Món nước)"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Mô tả"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Chọn ảnh:</Text>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Chọn ảnh" onPress={handlePickImage} />

      <Button title="Đăng món ăn" onPress={handleCreateFood} color={COLORS.primary} />
    </ScrollView>
  );
};

export default CreateFoodScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: COLORS.surface,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
