import React from 'react';
import WithQuizState from './WithQuizState';
import { firebase } from '../../firebase';

class NextButton extends WithQuizState {
  
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  _showNext() {
    var vm = this;

    if (vm.state.roomId && (vm.state.currentQuestion || vm.state.currentQuestion === 0) && vm.state.currentQuestion !== vm.state.numQuestions) {
      firebase.firestore
              .collection('rooms')
              .doc(vm.state.roomId)
              .update({
                  'currentQuestion': vm.state.currentQuestion+1,
                  'showAnswer': false,
                  'showsScores': false
              });
    }
  }

  handleClick(event) {
    this._showNext();  
  }

  render() {
    return (
      <button onClick={this.handleClick}>Next</button>
    );
  }
}

export default NextButton