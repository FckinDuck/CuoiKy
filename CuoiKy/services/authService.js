import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();

export const registerUser = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, {
    displayName,
    photoURL: 'https://picsum.photos/200',
  });

  const userData = {
    email: user.email,
    displayName,
    avatar: 'https://picsum.photos/200',
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
    theme: 'light',
    language: 'vi',
    notifications: true,
    role: 'user',
    isBanned: false,
  };

  await setDoc(doc(db, 'USERS', user.uid), userData);
  return { ...userData, uid: user.uid }; 
};


export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userRef = doc(db, 'USERS', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error('Không tìm thấy thông tin người dùng.');
  }

  const userData = userDoc.data();

  if (userData.isBanned) {
    throw new Error('Tài khoản đã bị khóa.');
  }

  await updateDoc(userRef, { lastLogin: serverTimestamp() });

  return { ...userData, uid: user.uid }; 
};

export const logoutUser = async () => {
  await signOut(auth);
};
