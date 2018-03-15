import React from 'react';
import WithQuizState from './WithQuizState';
import { firebase } from '../../firebase';

class ResetButton extends WithQuizState {
  
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  _resetQuiz() {
    var vm = this;

    if (vm.state.roomId && vm.state.currentQuestion) {
      var roomData = firebase.firestore
                              .collection('rooms')
                              .doc(vm.state.roomId);

      roomData.collection('users')
              .get()
              .then(function(querySnapshot) {
                  querySnapshot.forEach(function(userSnapshot) {
                  console.log(userSnapshot.id);
                  roomData.collection('users').doc(userSnapshot.id).update({'score': 0});
                  });
              });
      
      roomData.update({
          'currentQuestion': 1,
          'showAnswer': false,
          'showsScores': false
      });
    }
  }

  handleClick(event) {
    this._resetQuiz();
  }

  render() {
    return (
        <button onClick={this.handleClick}>Reset Quiz</button>
    );
  }
}

export default ResetButton