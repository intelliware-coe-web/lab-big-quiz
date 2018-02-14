import React, { Component } from 'react';
import { firebase } from '../../firebase';

const QuizPage = ({match}) =>
  <div>
    <QuizComponent room-id={match.params.roomId}/>
  </div>

class QuizComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: null,
      numQuestions: 0,
      currentQuestion: 0,
      question: '',
      code: '',
      hasMultipleCorrect: false,
      answers: [],
      score: 0,
      usersRef: null
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

      docRef.onSnapshot(function(roomSnapshot) {
        var questionNumber = roomSnapshot.data().currentQuestion;
        vm.setState({currentQuestion: questionNumber});
        vm.setState({showAnswer: roomSnapshot.data().showAnswer});

        docRef.collection('questions')
          .where('number', '==', questionNumber)
          .onSnapshot(function(questionSnapshot) {
            var questionData = questionSnapshot.docs[0].data();
            vm.setState({
              question: questionData.question,                        
              code: questionData.code,
              hasMultipleCorrect: questionData.hasMultipleCorrect
            });

            document.getElementById('question-form').reset();

            let usersRef = docRef.collection('users');
            vm.setState({usersRef: usersRef});

            docRef.collection('questions')
              .doc(questionSnapshot.docs[0].id)
              .collection('answers')
              .get()
              .then(function(answersSnapshot) {
                var answers = []
                answersSnapshot.forEach(function(answer) {
                  answers.push({
                    id: answer.data().id, 
                    answer: answer.data().answer, 
                    correct: answer.data().correct,
                    points: answer.data().points
                  });
                });
                vm.setState({
                  'answers': answers,
                  'fetched': true
                });
              });

            usersRef.where('email', '==', firebase.user.email)
              .get().then(users => {
                if (users.size === 0) {
                  usersRef.doc(firebase.user.uid).set({
                    name: firebase.user.displayName,
                    email: firebase.user.email,
                    score: 0
                  });
                }                
              });
            });    
        });
    }
  }

  get isCorrect() {
    return this.state.showAnswer ? 'show-answer': 'hide-answer';
  }

  get markup() {
    return {__html: this.state.code.replace(/\\t/g, '\u00a0').replace(/\\n/g, '<br/>')};
  }

  get renderQuestion() {
    return <h1>{this.state.question}</h1>
  }

  get renderCode() {
    return <code dangerouslySetInnerHTML={this.markup}></code>
  }

  get renderAnswers() {
    const answers = this.state.answers;
    const answerList = answers.map((answer, index) => {
      return <li key={index}>
          <label id={answer.id} data-correct={answer.correct} className={this.isCorrect}>
          {answer.answer }<input name={this.state.currentQuestion} type={this.state.hasMultipleCorrect ? "checkbox" : "radio"} 
                                value={answer.points} onChange={this.handleChange}/>
          </label></li>
    });

    return <ul className="quiz-questions">{answerList}</ul>;
  }

  handleChange(event) {
    let target = event.target;


    if (target.value) {
      let points = parseInt(target.checked ? target.value : -target.value);
      let newScore = this.state.score + points;
      this.setState({
        score: newScore
      })
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.state.usersRef.doc(firebase.user.uid).update({score: this.state.score});
  }

  render() {
    return (
      <div>
        <div>
          {this.renderQuestion}
        </div>
        <div>
          {this.renderCode}
        </div>
        <form id="question-form" onSubmit={this.handleSubmit}>
          {this.renderAnswers}
          <input type="submit" value="Submit"/>
        </form>
      </div>
    );
  }
}

export default QuizPage;

export {
  QuizComponent
};