import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONT_SIZES, SPACING } from '../utils/theme';
import { useAuth } from '../providers/AuthProvider';
import { encode as btoa } from 'base-64';
import { handleLike, handleDislike } from '../utils/likeUtils';

const DetailScreen = ({ route }) => {
  const { foodId } = route.params;
  const { user } = useAuth();
  const userId = btoa(user?.email || '');
  const [food, setFood] = useState(null);
  const [likeStatus, setLikeStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('user');

  useEffect(() => {
    if (user?.email) {
      const encodedUID = btoa(user.email);
      firestore()
        .collection('USERS')
        .doc(encodedUID)
        .get()
        .then(doc => {
          if (doc.exists) {
            setRole(doc.data().role || 'user');
          }
        });
    }
  }, [user]);

  useEffect(() => {
    const foodRef = firestore().collection('FOODS').doc(foodId);

    const unsubFood = foodRef.onSnapshot(doc => {
      if (doc.exists) {
        setFood({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    });

    const unsubLike = foodRef.collection('likes').doc(userId).onSnapshot(doc => {
      if (doc.exists) {
        setLikeStatus(doc.data().type);
      } else {
        setLikeStatus(null);
      }
    });

    return () => {
      unsubFood();
      unsubLike();
    };
  }, [foodId, userId]);

  if (loading || !food) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const onLike = () => handleLike({ user, role, food });
  const onDislike = () => handleDislike({ user, role, food });

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: food.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{food.name}</Text>
        <Text style={styles.category}>{food.category}</Text>
        <Text style={styles.description}>{food.description}</Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onLike} style={styles.actionBtn}>
            <Icon
              name="thumb-up-outline"
              size={24}
              color={likeStatus === 'like' ? COLORS.primary : COLORS.subText}
            />
            <Text style={styles.actionText}>{food.fame || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDislike} style={styles.actionBtn}>
            <Icon
              name="thumb-down-outline"
              size={24}
              color={likeStatus === 'dislike' ? COLORS.error : COLORS.subText}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  category: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.subText,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DetailScreen;
