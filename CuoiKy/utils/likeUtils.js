import firestore from '@react-native-firebase/firestore';
import { encode as btoa } from 'base-64';

const getTargetRef = (id,type ) => firestore().collection(type === 'food' ? 'FOODS' : 'COMMENTS').doc(id);


const updateFameWithRole = async (transaction, targetRef, userId, type, role, isRemoving, isSwitching) => {
  const fameChange = role === 'admin' ? 100 : 1;

  const targetDoc = await transaction.get(targetRef);
  if (!targetDoc.exists) return;

  const currentFame = targetDoc.data().fame || 0;

  let newFame = currentFame;

  if (type === 'like') {
    newFame += isRemoving ? -fameChange : fameChange;
    if (isSwitching) newFame += fameChange; 
  } else {
    newFame += isRemoving ? fameChange : -fameChange;
    if (isSwitching) newFame -= fameChange; 
  }

  transaction.update(targetRef, { fame: newFame });
};

export const handleLike = async ({ user, role, target }) => {
  if (!user?.email || !target?.id || !target?.type) return;

  const userId = btoa(user.email);
  const targetRef = getTargetRef(target.id, target.type);
  const likeDocRef = targetRef.collection('likes').doc(userId);
  const likeDoc = await likeDocRef.get();
  const currentType = likeDoc.exists ? likeDoc.data()?.type : null;

  const isLiked = currentType === 'like';
  const isSwitchingFromDislike = currentType === 'dislike';

  await firestore().runTransaction(async transaction => {
    if (isLiked) {
      transaction.delete(likeDocRef);
    } else {
      transaction.set(likeDocRef, { type: 'like' });
    }

    if (isSwitchingFromDislike) {
      transaction.delete(likeDocRef); 
      transaction.set(likeDocRef, { type: 'like' });
    }

    await updateFameWithRole(transaction, targetRef, userId, 'like', role, isLiked, isSwitchingFromDislike);
  });
};

export const handleDislike = async ({ user, role, target }) => {
  if (!user?.email || !target?.id || !target?.type) return;

  const userId = btoa(user.email);
  const targetRef = getTargetRef(target.type, target.id);
  const likeDocRef = targetRef.collection('likes').doc(userId);
  const likeDoc = await likeDocRef.get();
  const currentType = likeDoc.exists ? likeDoc.data()?.type : null;

  const isDisliked = currentType === 'dislike';
  const isSwitchingFromLike = currentType === 'like';

  await firestore().runTransaction(async transaction => {
    if (isDisliked) {
      transaction.delete(likeDocRef);
    } else {
      transaction.set(likeDocRef, { type: 'dislike' });
    }

    if (isSwitchingFromLike) {
      transaction.delete(likeDocRef);
      transaction.set(likeDocRef, { type: 'dislike' });
    }

    await updateFameWithRole(transaction, targetRef, userId, 'dislike', role, isDisliked, isSwitchingFromLike);
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
