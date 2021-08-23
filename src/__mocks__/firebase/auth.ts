export const createUserWithEmailAndPassword = jest.fn();
export const getAuth = () => ({
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
});

export const signInWithEmailAndPassword = jest.fn();
export const updateProfile = jest.fn();
export const User = jest.fn();
export const UserCredential = jest.fn();
