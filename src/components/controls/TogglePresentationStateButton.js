import React from 'react';
import WithQuizState from './WithQuizState';
import { firebase } from '../../firebase';
import PRESENTATION_STATE from '../../constants/presentationState';

class TogglePresentationStateButton extends WithQuizState {

  constructor(props) {
    super(props);
    this.state = {
      presentationState: PRESENTATION_STATE.SHOW_QUESTIONS
    };
    this.handleClick = this.handleClick.bind(this);
  }

  _setPresentationState(state) {
    var vm = this;
    let newPresentationState = vm.state.presentationState;

    if (vm.state.roomId && vm.state.currentQuestion) {
      newPresentationState = state;
      firebase.firestore
              .collection('rooms')
              .doc(vm.state.roomId)
              .update({
                'presentationState': state
              });
    }

    this.setState({
      presentationState: newPresentationState
    });
  }

  get _renderPresentationStateButtons() {
    return Object.keys(PRESENTATION_STATE).map((key, index) => {
      let presentationState = PRESENTATION_STATE[key];
      return <button key={index} onClick={this.handleClick(presentationState)}>{presentationState}</button>
    });
  }

  handleClick = (state) => (event) => {
    this._setPresentationState(state);
  }

  render() {
    return (
      <div>{this._renderPresentationStateButtons}</div>
    );
  }
}

export default TogglePresentationStateButton