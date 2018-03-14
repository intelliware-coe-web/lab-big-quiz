import React from 'react';
import WithQuizState from './WithQuizState';
import { firebase } from '../../firebase';

class ShowAnswerButton extends WithQuizState {
  
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  _showAnswer() {
    var vm = this;

    if (vm.state.roomId && vm.state.currentQuestion) {
      firebase.firestore
              .collection('rooms')
              .doc(vm.state.roomId)
              .update({
                'showAnswer': !vm.state.showAnswer
              });
    }
  }

  handleClick(event) {
    this._showAnswer();
  }
  
  render() {
    return (
      <button onClick={this.handleClick}>Show Answer</button>
    );
  }
}

export default ShowAnswerButton