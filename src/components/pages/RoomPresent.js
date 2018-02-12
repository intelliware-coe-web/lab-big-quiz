import React, { Component } from 'react';
import { firebase } from '../../firebase';

const RoomPresentPage = ({match}) =>
  <div>
    <PresentQuestion room-id={match.params.roomId}/>
  </div>

class WithQuizState extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentQuestion: 0,
      numQuestions: 0
    }
  }
  
}

class PresentQuestion extends WithQuizState {
  constructor(props) {
    super(props);
    this.state = {
      roomId: null,
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
                      console.log(questionData)
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
                                  correct: answer.data().correct});
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
    return <code className="prettyprint">{this.state.code}</code>
  }

  get renderAnswers() {
    const answers = this.state.answers;
    return answers.map((answer, index) => {
      return <li key={index} id={answer.id} data-correct={answer.correct} className={this.isCorrect}>{answer.answer}</li>
    });
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
        <ul>
          {this.renderAnswers}
        </ul>
      </div>
    );
  }
}

export default RoomPresentPage;

export {
  PresentQuestion
};