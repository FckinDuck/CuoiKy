import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { COLORS, FONT_SIZES, SPACING, RADIUS } from '../utils/theme';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../providers/AuthProvider';
import { encode as btoa } from 'base-64';
import { handleLike as likeUtil, handleDislike as dislikeUtil } from '../utils/likeUtils';

const FoodCard = ({
  food,
  onPress,
  onComment,
  onShare,
  onSave,
  onReport,
  onHide
}) => {
  const { user, role = 'user' } = useAuth();
  const userId = btoa(user?.email || '');
  const foodRef = firestore().collection('FOODS').doc(food.id);

  const [fame, setFame] = useState(food.fame || 0);
  const [commentCount, setCommentCount] = useState(food.commentCount || 0);
  const [likeStatus, setLikeStatus] = useState(null);

  useEffect(() => {
    if (!food?.id || !userId) return;

    const unsubscribeLike = foodRef.collection('likes').doc(userId).onSnapshot(doc => {
      if (doc.exists && doc.data()) {
        setLikeStatus(doc.data().type);
      } else {
        setLikeStatus(null);
      }
    });

    const unsubscribeFood = foodRef.onSnapshot(doc => {
      if (doc.exists) {
        const data = doc.data();
        if (data) {
          setFame(data.fame || 0);
          setCommentCount(data.commentCount || 0);
        }
      }
    });

    return () => {
      unsubscribeLike();
      unsubscribeFood();
    };
  }, [food?.id, userId]);

  const handleLike = async () => {
    await likeUtil({ user, role, food });
  };

  const handleDislike = async () => {
    await dislikeUtil({ user, role, food });
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.imageWrapper} onPress={onPress}>
        <Image source={{ uri: food.image }} style={styles.image} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onPress}>
        <Menu>
          <MenuTrigger style={styles.moreIcon}>
            <Icon name="dots-vertical" size={24} color={COLORS.text} />
          </MenuTrigger>
          <MenuOptions customStyles={menuOptionsStyles}>
            <MenuOption onSelect={onSave} text="Lưu" />
            <MenuOption onSelect={onShare} text="Chia sẻ" />
            <MenuOption onSelect={onReport} text="Báo cáo" />
            <MenuOption onSelect={onHide} text="Ẩn" />
          </MenuOptions>
        </Menu>
      </TouchableOpacity>

      <TouchableOpacity style={styles.info} onPress={onPress}>
        <Text style={styles.title}>{food.name}</Text>
        <Text style={styles.subtitle}>{food.category}</Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
            <Icon
              name="thumb-up-outline"
              size={20}
              color={likeStatus === 'like' ? COLORS.primary : COLORS.subText}
            />
            <Text style={styles.actionText}>{fame}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDislike} style={styles.actionBtn}>
            <Icon
              name="thumb-down-outline"
              size={20}
              color={likeStatus === 'dislike' ? COLORS.error : COLORS.subText}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onComment} style={styles.actionBtn}>
            <Icon name="comment-outline" size={20} color={COLORS.subText} />
            <Text style={styles.actionText}>{commentCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onShare} style={styles.actionBtn}>
            <Icon name="share-outline" size={20} color={COLORS.subText} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    marginVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    elevation: 3,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
  },
  moreIcon: {
    position: 'absolute',
    backgroundColor: COLORS.surface,
    bottom: 130,
    right: 8,
    borderRadius: 16,
  },
  info: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.subText,
    marginBottom: SPACING.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    flexWrap: 'wrap',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 8,
  },
  actionText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.subText,
    marginLeft: 4,
  },
});

const menuOptionsStyles = {
  optionsContainer: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },
  optionText: {
    fontSize: FONT_SIZES.medium,
    padding: 6,
    color: COLORS.text,
  },
};

export default FoodCard;
