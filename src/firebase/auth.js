import * as firebase from 'firebase';

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  firebase.auth().createUserWithEmailAndPassword(email, password);

export const googleProvider = new firebase.auth.GoogleAuthProvider();

export function doSignInWithGoogle() {
    return firebase.auth().signInWithRedirect(googleProvider);
}

  // Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  firebase.auth().signInWithEmailAndPassword(email, password);

// Sign out
export const doSignOut = () =>
  firebase.auth().signOut();