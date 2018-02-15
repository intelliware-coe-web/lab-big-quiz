import React, { Component } from 'react';
import { firebase } from '../../firebase';
import ReactGist from 'react-gist';

const RoomPresentPage = ({match}) =>
  <div>
    <PresentQuestion room-id={match.params.roomId}/>
  </div>

class PresentQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: null,
      numQuestions: 0,
      currentQuestion: 0,
      question: '',
      code: '',
      answers: [],
      players: []
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
              vm.setState({
                currentQuestion: questionNumber,
                showAnswer: roomSnapshot.data().showAnswer,
                showScores: roomSnapshot.data().showScores
              });
  
              docRef.collection('users')
                    .orderBy('score', 'desc')
                    .onSnapshot(function(querySnapshot) {
                      var players = []
                      querySnapshot.forEach(function(doc) {
                        players.push({name: doc.data().name, score: doc.data().score});
                      });
                      vm.setState({
                        'players': players
                      });
                    });

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
    return <h1>#{this.state.currentQuestion} {this.state.question}</h1>
  }

  get renderCode() {
    return this.state.code ? <ReactGist id="ba19438c5958d314752dc3d5973e855c" file={this.state.code}/> : null;
  }

  get renderAnswers() {
    const answers = this.state.answers;
    return answers.map((answer, index) => {
      return <li key={index} id={answer.id} data-correct={answer.correct} className={this.isCorrect}>{answer.answer}</li>
    });
  }

  get renderQuestionSection() {
    return <div>{this.renderQuestion}<div>{this.renderCode}</div><ul>{this.renderAnswers}</ul></div>;
  }

  get renderScores() {
    return <ul>{this.renderPlayerScores}</ul>
  }

  get renderPlayerScores() {
    const players = this.state.players;
    return players.map((player, index) => {
      return <li id={player.name + index}><h2><label>{player.name}:</label><span>{player.score}</span></h2></li>
    });
  }

  get showQuestionOrScores() {
    return !this.state.showScores ? this.renderQuestionSection : this.renderScores;
  }

  render() {
    return (
      <div>
        {this.showQuestionOrScores}
      </div>
    );
  }
}

export default RoomPresentPage;

export {
  PresentQuestion
};