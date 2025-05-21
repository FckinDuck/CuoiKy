import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

global.Buffer = require('buffer').Buffer;
const encodeEmail = (email) => Buffer.from(email).toString('base64');
const decodeEmail = (encoded) => Buffer.from(encoded, 'base64').toString('utf-8');

export const registerUser = async (email, password, displayName) => {
  const userCredential = await auth().createUserWithEmailAndPassword(email, password);
  const user = userCredential.user;

  await user.updateProfile({
    displayName,
    photoURL: 'https://picsum.photos/200',
  });

  const encodedEmail = encodeEmail(email);

  const userData = {
    email,
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

  await firestore().collection('USERS').doc(encodedEmail).set(userData);

  return { ...userData, uid: user.uid };
};

export const loginUser = async (email, password) => {
  const userCredential = await auth().signInWithEmailAndPassword(email, password);
  const user = userCredential.user;

  const encodedEmail = encodeEmail(email);
  const userDoc = await firestore().collection('USERS').doc(encodedEmail).get();

  if (!userDoc.exists) {
    throw new Error('Không tìm thấy thông tin người dùng.');
  }

  const userData = userDoc.data();

  if (!userData || userData.isBanned) {
    throw new Error('Tài khoản đã bị khóa hoặc dữ liệu không hợp lệ.');
  }

  await firestore().collection('USERS').doc(encodedEmail).update({
    lastLogin: firestore.FieldValue.serverTimestamp(),
  });

  return { ...userData, uid: user.uid };
};

export const logoutUser = async () => {
  await auth().signOut();
};
