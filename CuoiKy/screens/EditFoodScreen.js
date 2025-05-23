import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import { canEditFood } from '../utils/permissions';
import { useAuth } from '../providers/AuthProvider';
import { useNavigation } from '@react-navigation/native';

const EditFoodScreen = ({ route }) => {
  const { foodId } = route.params;
  const { user } = useAuth();
  const navigation = useNavigation();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');


  useEffect(() => {
    const fetchFood = async () => {
      try {
        const doc = await firestore().collection('FOODS').doc(foodId).get();
        if (!doc.exists) {
          Alert.alert('Lỗi', 'Món ăn không tồn tại.');
          navigation.goBack();
          return;
        }

        const foodData = { id: doc.id, ...doc.data() };

        if (!canEditFood(user, foodData)) {
          Alert.alert('Không có quyền', 'Bạn không thể chỉnh sửa món ăn này.');
          navigation.goBack();
          return;
        }

        setFood(foodData);
        setName(foodData.name || '');
        setDescription(foodData.description || '');
        setPrice(foodData.price?.toString() || '');
        setCategory(foodData.category || '');
        setImage(foodData.image || '');
      } catch (err) {
        console.error('Lỗi khi tải món ăn:', err);
        Alert.alert('Lỗi', 'Không thể tải dữ liệu.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [foodId, user, navigation]);

  const handleDelete = useCallback(() => {
    Alert.alert('Xác nhận xoá', 'Bạn có chắc muốn xoá món ăn này và toàn bộ bình luận?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          try {
            const batch = firestore().batch();

            const commentSnapshot = await firestore()
              .collection('COMMENT')
              .where('targetId', '==', foodId)
              .get();

            commentSnapshot.forEach(doc => {
              batch.delete(doc.ref);
            });

            const foodCommentDoc = await firestore().collection('COMMENT').doc(foodId).get();
            if (foodCommentDoc.exists) {
              batch.delete(foodCommentDoc.ref);
            }

            batch.delete(firestore().collection('FOODS').doc(foodId));

            await batch.commit();
            Alert.alert('Đã xoá', 'Món ăn và các bình luận đã bị xoá.');
            navigation.goBack();
          } catch (err) {
            console.error('Lỗi xoá:', err);
            Alert.alert('Lỗi', 'Không thể xoá món ăn.');
          }
        },
      },
    ]);
  }, [foodId, navigation]);

  useEffect(() => {
    if (food) {
      navigation.setOptions({
        headerRight: () => <Button title="Xoá" onPress={handleDelete} color="#d11a2a" />,
      });
    }
  }, [navigation, food, handleDelete]);

  const handleChooseImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (!result.didCancel && result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !price || isNaN(price)) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên và giá hợp lệ.');
      return;
    }

    try {
      setSaving(true);
      await firestore().collection('FOODS').doc(foodId).update({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category: category.trim(),
        image: image,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Thành công', 'Món ăn đã được cập nhật.');
      navigation.goBack();
    } catch (err) {
      console.error('Lỗi khi lưu:', err);
      Alert.alert('Lỗi', 'Không thể lưu thay đổi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !food) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Tên món</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput value={description} onChangeText={setDescription} style={styles.input} multiline />

      <Text style={styles.label}>Giá (VNĐ)</Text>
      <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />

      <Text style={styles.label}>Phân loại</Text>
      <TextInput value={category} onChangeText={setCategory} style={styles.input} />

      <Text style={styles.label}>Ảnh</Text>
      {image ? <Image source={{ uri: image }} style={styles.imagePreview} /> : null}
      <Button title="Chọn ảnh" onPress={handleChooseImage} />

      <View style={{ marginTop: 24 }}>
        <Button title={saving ? 'Đang lưu...' : 'Lưu thay đổi'} onPress={handleSave} disabled={saving} />
      </View>
    </ScrollView>
  );
};

export default EditFoodScreen;

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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
