import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const registerUser = async (email, password, displayName) => {
  const userCredential = await auth().createUserWithEmailAndPassword(email, password);
  const user = userCredential.user;

  await user.updateProfile({
    displayName,
    photoURL: 'https://picsum.photos/200',
  });

  const userData = {
    email: user.email,
    displayName,
    avatar: 'https://picsum.photos/200',
    createdAt: firestore.FieldValue.serverTimestamp(),
    lastLogin: firestore.FieldValue.serverTimestamp(),
    theme: 'light',
    language: 'vi',
    notifications: true,
    role: 'user',
    isBanned: false,
  };

  await firestore().collection('USERS').doc(user.uid).set(userData);
  return { ...userData, uid: user.uid };
};

export const loginUser = async (email, password) => {
  const userCredential = await auth().signInWithEmailAndPassword(email, password);
  const user = userCredential.user;

  const userDoc = await firestore().collection('USERS').doc(user.uid).get();

  if (!userDoc.exists) {
    throw new Error('Không tìm thấy thông tin người dùng.');
  }

  const userData = userDoc.data();

  if (userData.isBanned) {
    throw new Error('Tài khoản đã bị khóa.');
  }

  await firestore().collection('USERS').doc(user.uid).update({
    lastLogin: firestore.FieldValue.serverTimestamp(),
  });

  return { ...userData, uid: user.uid };
};

export const logoutUser = async () => {
  await auth().signOut();
};
