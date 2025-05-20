import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const auth = getAuth();

export const registerUser = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await userCredential.user.updateProfile({ displayName });
  return userCredential.user;
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};
