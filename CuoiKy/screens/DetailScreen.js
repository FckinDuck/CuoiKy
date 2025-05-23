import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image,
  ActivityIndicator, TouchableOpacity, Alert, ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../providers/AuthProvider';
import { canEditFood } from '../utils/permissions';
import CommentInput from '../components/CommentInput';
import { COLORS, FONT_SIZES, SPACING } from '../utils/theme';
import { encode as btoa } from 'base-64';
import { handleLike, handleDislike, handleFavorite } from '../utils/likeUtils';
import CommentSection from '../components/CommentSection';

const DetailScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const { foodId } = route.params;

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeStatus, setLikeStatus] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [fame, setFame] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const userId = btoa(user?.email || '');
  const foodRef = firestore().collection('FOODS').doc(foodId);
  const favoriteRef = firestore().collection('FAVORITE').doc(userId);

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
      setLikeStatus(doc.exists && doc.data() ? doc.data().type : null);
    });

    const unsubFood = foodRef.onSnapshot(doc => {
      
      if (doc.exists) {
        const data = doc.data();
        setFame(data.fame || 0);
        setCommentCount(data.commentCount || 0);
        setFood(prev => ({ ...prev, ...data }));
      }
    });
    

    const unsubscribeFavorite = favoriteRef.onSnapshot(doc => {
      if (doc.exists) {
        console.log('Favorite doc data:', doc.data());
        const list = doc?.data()?.foodIdList || [];
        const found = list.some(item =>
          typeof item === 'string' ? item === foodId : item.foodId === foodId
        );
        setIsFavorite(found);
      } else {
        setIsFavorite(false);
      }
    });

    return () => {
      unsubscribeLike();
      unsubFood();
      unsubscribeFavorite();
    };
  }, [foodId, userId]);

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

  useLayoutEffect(() => {
    const parent = navigation.getParent?.();
    if (parent) {
      parent.setOptions({ tabBarStyle: { display: 'none' } });
    }

    return () => {
      if (parent) {
        parent.setOptions({ tabBarStyle: undefined });
      }
    };
  }, [navigation]);

  const onLike = async () => {
    await handleLike({ user, target: { id: food.id, type: 'food' } });
  };

  const onDislike = async () => {
    await handleDislike({ user, target: { id: food.id, type: 'food' } });
  };

  const onToggleFavorite = async () => {
    await handleFavorite({ user, food, isFavorite });
  };

  const handleShare = async () => {
    try {
      const newCount = (food.shareCount || 0) + 1;
      await foodRef.update({ shareCount: newCount });
      setFood(prev => ({ ...prev, shareCount: newCount }));
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
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView>
        <Image source={{ uri: food.image }} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{food.name}</Text>
            <TouchableOpacity onPress={onToggleFavorite}>
              <Icon
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={26}
                color={isFavorite ? COLORS.primary : COLORS.subText}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Giá: {food.price?.toLocaleString()} VNĐ</Text>
          <Text style={styles.subtitle}>Loại: {food.category}</Text>
          <Text style={styles.description}>{food.description}</Text>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onLike} style={styles.actionBtn}>
              <Icon
                name="thumb-up-outline"
                size={22}
                color={likeStatus === 'like' ? COLORS.primary : COLORS.subText}
              />
              <Text style={styles.actionText}>{fame}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onDislike} style={styles.actionBtn}>
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
        <View style={{ height: 1, backgroundColor: COLORS.border }} />
        <Text style={{ padding: SPACING.md, fontSize: FONT_SIZES.medium }}>
          Bình luận
          </Text>
        <CommentSection foodId={food.id} />
      </ScrollView>
      <CommentInput foodId={food.id} user={user.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: '100%', height: 240 },
  info: { padding: SPACING.md },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: FONT_SIZES.xl, fontWeight: 'bold' },
  subtitle: { fontSize: FONT_SIZES.medium, color: COLORS.subText, marginTop: 4 },
  description: { fontSize: FONT_SIZES.medium, marginTop: SPACING.sm },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.lg,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: COLORS.border,
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
