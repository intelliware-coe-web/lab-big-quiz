import React, { Component } from 'react';

import './RoomControls.css';
import { firebase } from '../../firebase';

const RoomControlsPage = ({match}) =>
  <div>
    <h1>Room Controls</h1>

    <div className="container">
      <div>
        <PreviousButton room-id={match.params.roomId}/>
        <NextButton room-id={match.params.roomId}/>
        <ShowAnswerButton room-id={match.params.roomId}/>
      </div>

      <div>
        <QuizSetupForm room-id={match.params.roomId}/>
      </div>
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
              vm.setState({
                currentQuestion: roomSnapshot.data().currentQuestion,
                showAnswer: roomSnapshot.data().showAnswer
              });
            });

      docRef.collection('questions')
            .onSnapshot(function(questionsSnapshot) { 
              vm.setState({numQuestions: questionsSnapshot.size});
            });
    }
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
                 'showAnswer': false
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
                 'showAnswer': false
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
  
  renderQuestion(question) {
    return (
      <form onSubmit={this.updateQuestion}>
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