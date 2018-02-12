import React, { Component } from 'react';
import { firebase } from '../../firebase';

const QuizPage = ({match}) =>
  <div>
    <QuizComponent room-id={match.roomId}/>>
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
      answers: []
    }
  }

  componentWillReceiveProps(newProps) {
    var vm = this;

    var roomId = newProps['room-id'];
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
                        code: questionData.code
                      });

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
                            })
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
    return <code>{this.state.code}</code>
  }

  get renderAnswers() {
    const answers = this.state.answers;
    return answers.map((answer, index) => {
      return <label key={index} id={answer.id} data-correct={answer.correct} className={this.isCorrect}>{answer.answer}<input type="checkbox" value={answer.points}/></label>
    });
  }

  handleSubmit() {

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
        <form onSubmit={this.handleSubmit}>
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