import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();

export const registerUser = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Cập nhật thông tin người dùng
  await updateProfile(user, {
    displayName,
    photoURL: 'https://picsum.photos/200',
  });

  // Lưu vào Firestore (nếu cần dùng sau)
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    displayName,
    avatar: 'https://picsum.photos/200',
    createdAt: serverTimestamp(),
  });

  return {
    uid: user.uid,
    email: user.email,
    displayName,
    avatar: 'https://picsum.photos/200',
  };
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    avatar: user.photoURL || 'https://picsum.photos/200',
  };
};

export const logoutUser = async () => {
  await signOut(auth);
};
