import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import uuid from 'react-native-uuid';
import firestore from '@react-native-firebase/firestore'; // 👉 Dùng Firestore
import { useAuth } from '../providers/AuthProvider';

const CreateFoodScreen = ({ navigation }) => {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (!result.didCancel && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !category || !description || !price || !imageUri) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin món ăn');
      return;
    }

    try {
      const newFood = {
        id: `food_${uuid.v4()}`,
        name,
        category,
        description,
        image: imageUri,
        price: parseFloat(price),
        rating: 0,
        fame: 0,
        shareCount: 0,
        commentCount: 0,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        tags: [],
        restaurants: [],
        authorId: user?.uid || 'unknown',
        isReported: false,
      };

      await firestore()
        .collection('FOODS')
        .add(newFood);

      Alert.alert('Thành công', 'Món ăn đã được đăng tải');
      navigation.goBack();
    } catch (err) {
      console.error('Firestore error:', err);
      Alert.alert('Lỗi', err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Tên món</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Loại món</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>Giá (VNĐ)</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

      <Button title="Chọn ảnh" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      <Button title="Đăng món" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { marginBottom: 4, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 12,
    borderRadius: 8,
  },
});

export default CreateFoodScreen;
