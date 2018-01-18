import firebase from 'firebase'
var config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
  apiKey: "unreadablestuff",
  authDomain: "your-domain-name.firebaseapp.com",
  databaseURL: "https://your-domain-name.firebaseio.com",
  storageBucket: "your-domain-name.appspot.com",
  messagingSenderId: "123123123123"
};
var fire = firebase.initializeApp(config);
export default fire;

/*
<script src="https://www.gstatic.com/firebasejs/4.8.2/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC2mymmDhvnK71oKrz3QumfqPMnpFymOAM",
    authDomain: "big-web-quiz-3c841.firebaseapp.com",
    databaseURL: "https://big-web-quiz-3c841.firebaseio.com",
    projectId: "big-web-quiz-3c841",
    storageBucket: "",
    messagingSenderId: "280316876134"
  };
  firebase.initializeApp(config);
</script>
COPY

*/