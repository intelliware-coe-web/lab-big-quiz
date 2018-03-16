import React from 'react';
import WithQuizState from './WithQuizState';
import { firebase } from '../../firebase';
import PRESENTATION_STATE from '../../constants/presentationState';

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
                    roomData.collection('users').doc(userSnapshot.id)
                      .update({score: 0});
                  });
              });

      roomData.update({
          'currentQuestion': 1,
          'showAnswer': false,
          'presentationState': PRESENTATION_STATE.SHOW_QUESTIONS
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