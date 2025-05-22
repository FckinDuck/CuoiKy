import firestore from '@react-native-firebase/firestore';
import { encode as btoa } from 'base-64';

export const handleLike = async ({ user, role, food }) => {
  if (!user?.email || !food?.id) return;

  const userId = btoa(user.email);
  const foodRef = firestore().collection('FOODS').doc(food.id);
  const likesRef = foodRef.collection('likes').doc(userId);

  const likeDoc = await likesRef.get();
  const currentData = likeDoc.exists ? likeDoc.data() : {};
  const isLiked = currentData?.type === 'like';

  const fameChange = role === 'admin' ? 100 : 1;

  await firestore().runTransaction(async transaction => {
    const foodDoc = await transaction.get(foodRef);
    if (!foodDoc.exists) return;

    const currentFame = foodDoc.data().fame || 0;

    if (isLiked) {
      transaction.delete(likesRef);
      transaction.update(foodRef, { fame: currentFame - fameChange });
    } else {
      transaction.set(likesRef, { type: 'like' });
      transaction.update(foodRef, { fame: currentFame + fameChange });

      const prevDislike = await foodRef.collection('likes').doc(userId).get();
      if (prevDislike.exists && prevDislike.data()?.type === 'dislike') {
        transaction.delete(foodRef.collection('likes').doc(userId));
      }
    }
  });
};

export const handleDislike = async ({ user, role, food }) => {
  if (!user?.email || !food?.id) return;

  const userId = btoa(user.email);
  const foodRef = firestore().collection('FOODS').doc(food.id);
  const likesRef = foodRef.collection('likes').doc(userId);

  const dislikeDoc = await likesRef.get();
  const currentData = dislikeDoc.exists ? dislikeDoc.data() : {};
  const isDisliked = currentData?.type === 'dislike';

  const fameChange = role === 'admin' ? 100 : 1;

  await firestore().runTransaction(async transaction => {
    const foodDoc = await transaction.get(foodRef);
    if (!foodDoc.exists) return;

    const currentFame = foodDoc.data().fame || 0;

    if (isDisliked) {
      transaction.delete(likesRef);
      transaction.update(foodRef, { fame: currentFame + fameChange });
    } else {
      transaction.set(likesRef, { type: 'dislike' });
      transaction.update(foodRef, { fame: currentFame - fameChange });

      const prevLike = await foodRef.collection('likes').doc(userId).get();
      if (prevLike.exists && prevLike.data()?.type === 'like') {
        transaction.delete(foodRef.collection('likes').doc(userId));
      }
    }
  });
};

export const handleFavorite = async ({ user, food, isFavorite }) => {
  const userId = btoa(user?.email || '');
  const favDocRef = firestore().collection('FAVORITE').doc(userId);

  try {
    const favDoc = await favDocRef.get();
    const currentList = favDoc.exists ? favDoc.data().foodIdList || [] : [];

    const index = currentList.findIndex(item => item.foodId === food.id);
    let updatedFoodIdList = [];

    if (isFavorite && index !== -1) {
    
      updatedFoodIdList = currentList.filter(item => item.foodId !== food.id);
    } else if (!isFavorite && index === -1) {
      
      updatedFoodIdList = [...currentList, { foodId: food.id }];
    } else {
      
      updatedFoodIdList = currentList;
    }

    await favDocRef.set({ foodIdList: updatedFoodIdList }, { merge: true });
  } catch (error) {
    console.error('handleFavorite error:', error);
  }
};
