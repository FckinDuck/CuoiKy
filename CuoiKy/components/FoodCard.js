import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { COLORS, FONT_SIZES, SPACING, RADIUS } from '../utils/theme';

const FoodCard = ({
  food,
  onPress,
  onLike,
  onDislike,
  onComment,
  onShare,
  onSave,
  onReport,
  onHide
}) => {
  return (

    <View style={styles.card}>
      <TouchableOpacity style={styles.imageWrapper} onPress={onPress}>
        <Image source={{ uri: food.image }} style={styles.image} />
      </TouchableOpacity>

      <View>
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
      </View>

      <TouchableOpacity style={styles.info} onPress={onPress}>
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

    top: 8,
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
