import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../providers/AuthProvider';
import { canEditFood } from '../utils/permissions'; 
import { COLORS, FONT_SIZES, SPACING } from '../utils/theme';

const DetailScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const { foodId } = route.params;

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const doc = await firestore().collection('FOODS').doc(foodId).get();
        if (doc.exists) {
          setFood({ id: doc.id, ...doc.data() });
        }
      } catch (err) {
        console.error('Error loading food:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [foodId]);

  useLayoutEffect(() => {
    if (food && canEditFood(user, food)) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('EditFood', { foodId })}
            style={{ marginRight: 16 }}
          >
            <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Chỉnh sửa</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, food, user]);

  if (loading || !food) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: food.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{food.name}</Text>
        <Text style={styles.subtitle}>Giá: {food.price?.toLocaleString()} VNĐ</Text>
        <Text style={styles.subtitle}>Loại: {food.category}</Text>
        <Text style={styles.description}>{food.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  image: { width: '100%', height: 240, borderRadius: 12 },
  info: { padding: SPACING.md },
  title: { fontSize: FONT_SIZES.xl, fontWeight: 'bold' },
  subtitle: { fontSize: FONT_SIZES.medium, color: COLORS.subText, marginTop: 4 },
  description: { fontSize: FONT_SIZES.medium, marginTop: SPACING.sm },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default DetailScreen;
