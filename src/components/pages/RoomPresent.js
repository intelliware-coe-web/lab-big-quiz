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
      question: {}
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
                      var question = questionSnapshot.docs[0].data();
                      vm.setState({question: question})
                  });
            });
    }
  }

  get renderQuestion() {
    return <div><h1>{this.state.question.question}</h1></div>
  }

  render() {
    return (
      <div>{this.renderQuestion}</div>
    );
  }
}

export default RoomPresentPage;

export {
  PresentQuestion
};