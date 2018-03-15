import React from 'react';
import WithQuizState from './WithQuizState';
import { firebase } from '../../firebase';
import PRESENTATION_STATE from '../../constants/presentationState';

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
                  'presentationState': PRESENTATION_STATE.SHOW_QUESTIONS
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