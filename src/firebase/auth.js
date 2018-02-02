import * as firebase from 'firebase';

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  firebase.auth().createUserWithEmailAndPassword(email, password);

export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const doSignInWithGoogle = () =>
  firebase.auth().signInWithPopup(googleProvider);

  // Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  firebase.auth().signInWithEmailAndPassword(email, password);

// Sign out
export const doSignOut = () =>
  firebase.auth().signOut();