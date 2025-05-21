import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONT_SIZES, SPACING, RADIUS } from '../utils/theme';

const FoodCard = ({ food, onPress, onLike, onDislike, onComment, onShare }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: food.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{food.name}</Text>
        <Text style={styles.subtitle}>{food.category}</Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onLike} style={styles.actionBtn}>
            <Icon name="thumb-up-outline" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>Thích</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDislike} style={styles.actionBtn}>
            <Icon name="thumb-down-outline" size={20} color={COLORS.error} />
            <Text style={styles.actionText}>Không thích</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onComment} style={styles.actionBtn}>
            <Icon name="comment-outline" size={20} color={COLORS.subText} />
            <Text style={styles.actionText}>Bình luận</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onShare} style={styles.actionBtn}>
            <Icon name="share-outline" size={20} color={COLORS.subText} />
            <Text style={styles.actionText}>Chia sẻ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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
  image: {
    width: '100%',
    height: 160,
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
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.subText,
    marginLeft: 4,
  },
});

export default FoodCard;
