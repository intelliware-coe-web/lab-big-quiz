import React from 'react';
import WithQuizState from './WithQuizState';
import { firebase } from '../../firebase';

class PreviousButton extends WithQuizState {
  
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  _showPrevious() {
    var vm = this;

    if (vm.state.roomId && vm.state.currentQuestion) {
      firebase.firestore
              .collection('rooms')
              .doc(vm.state.roomId)
              .update({
                  'currentQuestion': vm.state.currentQuestion-1,
                  'showAnswer': false,
                  'showsScores': false
              });
    }
  }

  handleClick(event) {
    this._showPrevious();
  }

  render() {
    return (
      <button onClick={this.handleClick}>Previous</button>
    );
  }
}

export default PreviousButton