import React, { Component } from 'react';

import './RoomControls.css';
import { firebase } from '../../firebase';

const RoomControlsPage = ({match}) =>
  <div>
    <h1>Room Controls</h1>

    <div>
      <PreviousButton room-id={match.params.roomId}/>
      <NextButton room-id={match.params.roomId}/>
      <ShowAnswerButton room-id={match.params.roomId}/>
      <ShowScoresButton room-id={match.params.roomId}/>
      <ResetButton room-id={match.params.roomId}></ResetButton>
    </div>
  </div>

class WithQuizState extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentQuestion: 0,
      numQuestions: 0,
      showAnswer: false,
      showScores: false
    }
  }
  componentWillReceiveProps(newProps) {
    var vm = this;

    var roomId = newProps['room-id'];
    vm.setState({roomId: roomId});

    if (roomId) {
      var docRef = firebase.firestore.collection('rooms').doc(roomId);

      docRef.onSnapshot(function(roomSnapshot) {        
              vm.setState({
                currentQuestion: roomSnapshot.data().currentQuestion,
                showAnswer: roomSnapshot.data().showAnswer,
                showScores: roomSnapshot.data().showScores
              });
            });

      docRef.collection('questions')
            .onSnapshot(function(questionsSnapshot) { 
              vm.setState({numQuestions: questionsSnapshot.size});
            });
    }
  }
}

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
                 'showScores': false
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

class QuizSetupForm extends WithQuizState {
  constructor(props) {
    super(props);
    this.state = {
      questions: []
    };
  }

  componentDidUpdate(prevProps, prevState) {
    var vm = this;

    if (this.state.roomId && this.state.roomId !== prevState.roomId) {
      firebase.firestore
              .collection('rooms')
              .doc(this.state.roomId)
              .collection('questions')
              .onSnapshot(function(querySnapshot) {
                var questions = [];
                querySnapshot.forEach(function(doc) {
                  questions.push({
                    id: doc.id,
                    number: doc.data().number,
                    question: doc.data().question
                  })
                });
                vm.setState({questions: questions});
              });
    }
  }


  updateQuestion(event) {
    event.preventDefault();    
  }

  handleSubmit(text) {
    return function(event) {
      event.preventDefault()
      console.log(text)
    }.bind(this)
  }
  
  
  renderQuestion(question) {
    return (
      <form onSubmit={this.handleSubmit(question)}>
        <label>Question:</label>
        <textarea type="text" value={question.question}/>        
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
  NextButton,
  ShowAnswerButton
};