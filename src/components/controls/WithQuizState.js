import { Component } from 'react';
import { firebase } from '../../firebase';

class WithQuizState extends Component {
  
    constructor(props) {
      super(props);
  
      this.state = {
        currentQuestion: 0,
        numQuestions: 0,
        showAnswer: false,
        showScores: false
      }
    }

    componentWillReceiveProps(newProps) {
      var vm = this;
  
      var roomId = newProps['room-id'];
      vm.setState({roomId: roomId});
  
      if (roomId) {
        var docRef = firebase.firestore.collection('rooms').doc(roomId);
  
        docRef.onSnapshot(function(roomSnapshot) {        
          vm.setState({
            currentQuestion: roomSnapshot.data().currentQuestion,
            showAnswer: roomSnapshot.data().showAnswer,
            showScores: roomSnapshot.data().showScores
          });
        });
  
        docRef.collection('questions')
              .onSnapshot(function(questionsSnapshot) { 
                vm.setState({numQuestions: questionsSnapshot.size});
              });
      }
    }
}

export default WithQuizState