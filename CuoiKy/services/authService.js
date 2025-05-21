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

const firebaseConfig = {
  apiKey: "AIzaSyCcJPjOoDiQfUdfY51XIo14TH3ZPrmGLPg",
  authDomain: "cuoiky-c8805.firebaseapp.com",
  projectId: "cuoiky-c8805",
  storageBucket: "cuoiky-c8805.firebasestorage.app",
  messagingSenderId: "843870247737",
  appId: "1:843870247737:android:72efda742ff8c8a13666e8",
}


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
