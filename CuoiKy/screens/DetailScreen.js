import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../providers/AuthProvider';
import { canEditFood } from '../utils/permissions';
import { COLORS, FONT_SIZES, SPACING } from '../utils/theme';
import { encode as btoa } from 'base-64';

const DetailScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const { foodId } = route.params;

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeStatus, setLikeStatus] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [fame, setFame] = useState(0);

  const userId = btoa(user?.email || '');
  const foodRef = firestore().collection('FOODS').doc(foodId);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const doc = await foodRef.get();
        if (doc.exists) {
          const data = doc.data();
          setFood({ id: doc.id, ...data });
          setFame(data.fame || 0);
          setCommentCount(data.commentCount || 0);
        }
      } catch (err) {
        console.error('Error loading food:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();

    const unsubscribeLike = foodRef.collection('likes').doc(userId).onSnapshot(doc => {
      setLikeStatus(doc.exists ? doc.data().type : null);
    });

    const unsubFood = foodRef.onSnapshot(doc => {
      if (doc.exists) {
        const data = doc.data();
        setFame(data.fame || 0);
        setCommentCount(data.commentCount || 0);
      }
    });

    return () => {
      unsubscribeLike();
      unsubFood();
    };
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

  const handleLike = async () => {
    const likeDoc = foodRef.collection('likes').doc(userId);
    const current = likeStatus;

    if (current === 'like') {
      await likeDoc.delete();
      await foodRef.update({ fame: fame - 1 });
      setFame(fame - 1);
    } else {
      await likeDoc.set({ type: 'like' });
      const fameChange = current === 'dislike' ? 2 : 1;
      await foodRef.update({ fame: fame + fameChange });
      setFame(fame + fameChange);
    }
  };

  const handleDislike = async () => {
    const likeDoc = foodRef.collection('likes').doc(userId);
    const current = likeStatus;

    if (current === 'dislike') {
      await likeDoc.delete();
      await foodRef.update({ fame: fame + 1 });
      setFame(fame + 1);
    } else {
      await likeDoc.set({ type: 'dislike' });
      const fameChange = current === 'like' ? -2 : -1;
      await foodRef.update({ fame: fame + fameChange });
      setFame(fame + fameChange);
    }
  };

  const handleShare = async () => {
    try {
      const newCount = (food.shareCount || 0) + 1;
      await foodRef.update({ shareCount: newCount });
      setFood({ ...food, shareCount: newCount });
      Alert.alert('Đã chia sẻ', 'Bạn đã chia sẻ món ăn này.');
    } catch (err) {
      console.error('Share error:', err);
    }
  };

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

        <View style={styles.actions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
            <Icon
              name="thumb-up-outline"
              size={22}
              color={likeStatus === 'like' ? COLORS.primary : COLORS.subText}
            />
            <Text style={styles.actionText}>{fame}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDislike} style={styles.actionBtn}>
            <Icon
              name="thumb-down-outline"
              size={22}
              color={likeStatus === 'dislike' ? COLORS.error : COLORS.subText}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Icon name="comment-outline" size={22} color={COLORS.subText} />
            <Text style={styles.actionText}>{commentCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
            <Icon name="share-outline" size={22} color={COLORS.subText} />
            <Text style={styles.actionText}>{food.shareCount || 0}</Text>
          </TouchableOpacity>
        </View>
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.lg,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: COLORS.border || '#ccc',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.subText,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default DetailScreen;
