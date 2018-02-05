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

class WithQuizState extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentQuestion: 0,
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
              vm.setState({currentQuestion: roomSnapshot.data()['current-question']});
            });

      docRef.collection('questions')
            .onSnapshot(function(questionsSnapshot) { 
              vm.setState({numQuestions: questionsSnapshot.size});
            });
    }
  }
}


class PreviousButton extends WithQuizState {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    var vm = this;

    if (vm.state.roomId && vm.state.currentQuestion) {
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

class NextButton extends WithQuizState {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    var vm = this;

    if (vm.state.roomId && (vm.state.currentQuestion || vm.state.currentQuestion === 0) && vm.state.currentQuestion !== vm.state.numQuestions) {
      firebase.firestore
              .collection('rooms')
              .doc(vm.state.roomId)
              .update({
                 'current-question': vm.state.currentQuestion+1
              });
    }
  }

  render() {
    return (
      <button onClick={this.handleClick}>Next</button>
    );
  }
}

class QuizSetupForm extends WithQuizState {
  constructor(props) {
    super(props);
    this.state = {
      questions: []
    };
  }

  updateQuestion(event) {
    event.preventDefault();    
  }
  
  renderQuestion(question) {
    return (
      <form onSubmit={this.updateQuestion}>
        <label>Question:</label>
        <input type="text" value={question.question}/>
        {this.renderAnswers(question)}
        <input type="submit" value="Submit" />
      </form>
    );
  }

  get renderQuestionForm() {
    const questions = this.state.questions;
    return questions.map((question, index) => {
      return <div>{this.renderQuestion(question)}</div>
    });
  }

  render() {
    return (
      <div>
        {this.renderQuestionForm}
      </div>      
    );
  }
}

export default RoomControlsPage;

export {
  QuizSetupForm,
  PreviousButton,
  NextButton
};