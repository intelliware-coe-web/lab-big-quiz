import { Component } from 'react';
import { firebase } from '../../firebase';
import PRESENTATION_STATE from '../../constants/presentationState';

class WithQuizState extends Component {

    constructor(props) {
      super(props);
  
      this.state = {
        currentQuestion: 0,
        numQuestions: 0,
        showAnswer: false,
        presentationState: PRESENTATION_STATE.SHOW_QUESTIONS
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
            presentationState: roomSnapshot.data().presentationState
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