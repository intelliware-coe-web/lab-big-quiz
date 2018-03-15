import React, { Component } from 'react';
import { firebase } from '../../firebase';
import ReactGist from 'react-gist';
<<<<<<< HEAD
import PRESENTATION_STATE from '../../constants/presentationState';
=======
import Gravatar from 'react-gravatar';
>>>>>>> fixing scoring and showing gravatars

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
          presentationState: roomSnapshot.data().presentationState
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
<<<<<<< HEAD

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
=======
  
              docRef.collection('users')
                    .orderBy('score', 'desc')
                    .onSnapshot(function(querySnapshot) {
                      var players = []
                      querySnapshot.forEach(function(doc) {
                        players.push(doc.data());
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
>>>>>>> fixing scoring and showing gravatars
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
      return <li key={'answer'+index} id={answer.id} data-correct={answer.correct} className={this.isCorrect}>{answer.answer}</li>
    });
  }

  get renderQuestionSection() {
    return <div>{this.renderQuestion}<div>{this.renderCode}</div><ul>{this.renderAnswers}</ul></div>;
  }

  get renderScoreBreakdownList() {
    return <ul className="quiz-questions">{this.renderScoreBreakdown}</ul>
  }

  get renderScoreBreakdown() {
    const answers = this.state.answers;
    return answers.map((answer, index) => {
      return <li key={index} id={answer.id} data-correct={answer.correct} className={this.isCorrect}>
        <h2>
          <label>{answer.answer}: </label>
          <span>TODO</span>
        </h2>
      </li>
    });
  }

  get renderScores() {
    return <ul className="scores">{this.renderPlayerScores}</ul>
  }

  get renderPlayerScores() {
    const players = this.state.players;
    return players.map((player, index) => {
<<<<<<< HEAD
      return <li key={index} id={player.name + index}><h2><label>{player.name}:</label><span>{player.score}</span></h2></li>
=======
      return <li key={'player-'+index}><h2>
        <Gravatar email={player.email} rating="pg" default="robohash" size={250}></Gravatar>
        <label>{player.name}:</label><span>{player.score}</span></h2></li>
>>>>>>> fixing scoring and showing gravatars
    });
  }

  get renderRoomBasedOnPresentationState() {
    switch (this.state.presentationState) {
      case PRESENTATION_STATE.SHOW_QUESTIONS:
        return this.renderQuestionSection;
      case PRESENTATION_STATE.SHOW_SCORE_BREAKDOWN:
        return this.renderScoreBreakdownList;
      case PRESENTATION_STATE.SHOW_SCORES:
        return this.renderScores;
      default: return this.renderQuestionSection;
    }
  }

  render() {
    return (
      <div className="present">
        {this.renderRoomBasedOnPresentationState}
      </div>
    );
  }
}

export default RoomPresentPage;

export {
  PresentQuestion
};