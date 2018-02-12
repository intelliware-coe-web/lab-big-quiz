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
              var questionNumber = roomSnapshot.data()['current-question'];
              vm.setState({currentQuestion: questionNumber});
              docRef.collection('questions')
                    .where('number', '==', questionNumber)
                    .onSnapshot(function(questionSnapshot) {
                      console.log(questionSnapshot)
                      vm.setState({question: questionSnapshot.docs[0].data().question})
                      vm.setState({code: questionSnapshot.docs[0].data().code})

                      docRef.collection('questions').doc(questionSnapshot.docs[0].id)
                                      .collection('answers')
                                      .get()
                                      .then(function(answersSnapshot) {
                                        var answers = []
                                        answersSnapshot.forEach(function(answer) {
                                          answers.push({id: answer.data().id, answer: answer.data().answer});
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

  get renderQuestion() {
    return <h1>{this.state.question}</h1>
  }

  get renderAnswers() {
    const answers = this.state.answers;
    return answers.map((answer, index) => {
      return <li key={answer.id}>{answer.answer}</li>
    });
  }

  render() {
    return (
      <div>
        <div>
        {this.renderQuestion}
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