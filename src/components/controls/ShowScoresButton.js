import React from 'react';
import WithQuizState from './WithQuizState';
import { firebase } from '../../firebase';

class ShowScoresButton extends WithQuizState {
  
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  _showScores() {
    var vm = this;

    if (vm.state.roomId && vm.state.currentQuestion) {
      firebase.firestore
              .collection('rooms')
              .doc(vm.state.roomId)
              .update({
                  'showScores': !vm.state.showScores
              });
    }
  }

  handleClick(event) {
    this._showScores();
  }

  render() {
    return (
      <button onClick={this.handleClick}>Show Scores</button>
    );
  }
}

export default ShowScoresButton