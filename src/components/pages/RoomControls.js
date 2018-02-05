import React, { Component } from 'react';
import { firebase } from '../../firebase';

const RoomControlsPage = ({match}) =>
  <div>
    <h1>Room Controls</h1>

    <div>
      <PreviousButton room-id={match.params.roomId}/>
      <NextButton room-id={match.params.roomId}/>
    </div>

    <div>
      <QuizSetupForm room-id={match.params.roomId}/>
    </div>
  </div>


class PreviousButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      numQuestions: 0
    }
  }

  componentWillReceiveProps(newProps) {
    var vm = this;

    var roomId = newProps['room-id'];
    vm.setState({roomId: roomId});

    if (roomId) {
      var docRef = firebase.firestore.collection('rooms').doc(roomId);

      docRef.onSnapshot(function(roomSnapshot) {
              console.log(roomSnapshot.data());
              vm.setState({currentQuestion: roomSnapshot.data()['current-question']});
            });

      docRef.collection('questions')
            .onSnapshot(function(questionsSnapshot) { 
              vm.setState({numQuestions: questionsSnapshot.size});
            });
    }
  }

  handleClick(event) {
    var vm = this;

    if (vm.state.roomId && vm.state.currentQuestion) {
      console.log('vm.state.currentQuestion', vm.state.currentQuestion);
      firebase.firestore
              .collection('rooms')
              .doc(vm.state.roomId)
              .update({
                 'current-question': vm.state.currentQuestion-1
              });
    }
  }

  render() {
    return (
      <button onClick={this.handleClick}>Previous</button>
    );
  }
}

class NextButton extends Component {
  handleClick(event) {
    alert('Next was clicked');
  }

  render() {
    return (
      <button onClick={this.handleClick}>Next</button>
    );
  }
}

class QuizSetupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Questions go here.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An data was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Questions:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default RoomControlsPage;

export {
  QuizSetupForm,
  PreviousButton,
  NextButton
};