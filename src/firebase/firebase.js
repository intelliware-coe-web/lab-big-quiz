const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const prodConfig = {
  apiKey: 'AIzaSyC2mymmDhvnK71oKrz3QumfqPMnpFymOAM',
  authDomain: 'big-web-quiz-3c841.firebaseapp.com',
  databaseURL: 'https://big-web-quiz-3c841.firebaseio.com',
  projectId: 'big-web-quiz-3c841',
  storageBucket: '',
  messagingSenderId: '280316876134',
};

const devConfig = {
  apiKey: 'AIzaSyC2mymmDhvnK71oKrz3QumfqPMnpFymOAM',
  authDomain: 'big-web-quiz-3c841.firebaseapp.com',
  databaseURL: 'https://big-web-quiz-3c841.firebaseio.com',
  projectId: 'big-web-quiz-3c841',
  storageBucket: '',
  messagingSenderId: '280316876134',
};

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig;


if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export {
  auth,
  firestore
};
