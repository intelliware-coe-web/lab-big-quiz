import React, { Component } from 'react';
import { firebase } from '../../firebase';
import ReactGist from 'react-gist';

import './Quiz.css';

const QuizPage = ({match}) =>
  <div>
    <QuizComponent room-id={match.params.roomId}/>
  </div>

class QuizComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: null,
      questionId: null,
      numQuestions: 0,
      currentQuestion: 0,
      question: '',
      code: '',
      hasMultipleCorrect: false,
      answers: [],
      preQuestionScore: 0,
      score: 0,
      userRef: null,
      formSubmitted: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    let vm = this;

    let roomId = newProps['room-id'];
    vm.setState({roomId: roomId});

    if (roomId) {
      var docRef = firebase.firestore.collection('rooms').doc(roomId);

      if (firebase.user) {
        let userRef = docRef.collection('users').doc(firebase.user.uid);
        vm.setState({userRef: userRef});

        userRef.get().then(function(userData) {
          if (!userData) {
            userRef.set({
              name: firebase.user.displayName,
              email: firebase.user.email,
              score: 0
            });
          }
        })        
      } else {
        window.location('/');
      }

      docRef.onSnapshot(function(roomSnapshot) {
        var questionNumber = roomSnapshot.data().currentQuestion;
        vm.setState({
          currentQuestion: questionNumber,
          showAnswer: roomSnapshot.data().showAnswer
        });

        docRef.collection('users').doc(firebase.user.uid).get().then(function(userSnapshot) {
          let currentScore = parseInt(userSnapshot.data().score, 10);
          vm.setState({
            score: 0,
            preQuestionScore: currentScore ? currentScore : 0
          });
        });

        docRef.collection('questions')
          .where('number', '==', questionNumber)
          .get()
          .then(function(questionSnapshot) {
            var questionData = questionSnapshot.docs[0].data();
            vm.setState({
              question: questionData.question,
              questionId: questionSnapshot.docs[0].id,
              code: questionData.code,
              hasMultipleCorrect: questionData.hasMultipleCorrect
            });
            
            document.getElementById('question-form').reset();

            docRef.collection('questions')
              .doc(questionSnapshot.docs[0].id)
              .collection('answers')
              .get()
              .then(function(answersSnapshot) {
                var answers = []
                answersSnapshot.forEach(function(answer) {
                  answers.push({
                    id: answer.id,
                    answer: answer.data().answer,
                    correct: answer.data().correct,
                    selected: false,
                    points: answer.data().points
                  });
                });
                vm.setState({
                  'answers': answers,
                  'fetched': true
                });
              });
        });
      });      
    }
  }

  get isCorrect() {
    return this.state.showAnswer ? 'show-answer': 'hide-answer';
  }

  get renderQuestion() {
    return <h1>{this.state.question}</h1>
  }

  get renderCode() {
    return this.state.code ? <ReactGist id="ba19438c5958d314752dc3d5973e855c" file={this.state.code}/> : null;
  }

  get renderAnswers() {
    const answers = this.state.answers;
    const answerList = answers.map((answer, index) => {
      return <li key={index}>
          <label id={answer.id} data-correct={answer.correct} className={this.isCorrect}>
            <input name={this.state.currentQuestion} 
                   type={this.state.hasMultipleCorrect ? "checkbox" : "radio"} 
                   value={answer.points} disabled={this.state.showAnswer}
                   onChange={this.handleChange(index)}/>
            <span>{answer.answer}</span>
          </label>
        </li>
    });

    return <ul className="quiz-questions">{answerList}</ul>;
  }

  handleChange = (answerIndex) => (event) => {
    let target = event.target;

    if (target.value) {
      let points = parseInt(target.checked ? target.value : -target.value, 10);
      let newScore = Number.isInteger(this.state.score) ? this.state.score + points : points;

      this.setState({
        score: newScore,
        formSubmitted: false
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.showAnswer) {
      const answeredQuestionIds = this.state.answers
        .filter(answer => answer.selected)
        .map(answer => {
          return answer.id;
        });

      let updatedScore = this.state.preQuestionScore + this.state.score;
      this.setState({
        formSubmitted: true
      });

      this.state.userRef.update({
        score: updatedScore,
        answeredQuestions: answeredQuestionIds
      });
    }
  }

  render() {
    return (
      <div className="quiz">
        <div>
          {this.renderQuestion}
        </div>
        <div>
          {this.renderCode}
        </div>
        <form id="question-form" onSubmit={this.handleSubmit}>
          {this.renderAnswers}
          <input type="submit" disabled={this.state.showAnswer} value={this.state.formSubmitted ? 'Submitted' : 'Submit'}/>
        </form>
      </div>
    );
  }
}

export default QuizPage;

export {
  QuizComponent
};