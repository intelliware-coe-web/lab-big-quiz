import React, { Component } from 'react';
import { firebase } from '../../firebase';
import ReactGist from 'react-gist';
import Gravatar from 'react-gravatar';
import PRESENTATION_STATE from '../../constants/presentationState';

import './Score.css';

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
      players: [],
      topPlayers: []
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
                let topPlayers = [];
                let players = [];
                let index = 0;

                querySnapshot.forEach(function(doc) {
                  if (index > 2) {
                    players.push(doc.data());
                  } else {
                    topPlayers.push(doc.data());
                  }
                  index++;
                });

                vm.setState({
                  'players': players,
                  'topPlayers': topPlayers
                });
              });

        docRef.collection('questions')
              .where('number', '==', questionNumber)
              .onSnapshot(function(questionSnapshot) {
                var questionData = questionSnapshot.docs[0].data();
                let questionId = questionSnapshot.docs[0].id;

                vm.setState({
                  question: questionData.question,
                  code: questionData.code
                });

                docRef.collection('questions').doc(questionId)
                      .collection('answers').get()
                      .then(function(answersSnapshot) {
                        var answers = [];
                        answersSnapshot.forEach(function(answer) {
                          answers.push({
                            id: answer.id,
                            answer: answer.data().answer,
                            correct: answer.data().correct
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
    const answers = this.state.answers;
    const scoreBreakdown = answers.map((answer, index) => {
      return <li key={index} id={answer.id} data-correct={answer.correct} className={this.isCorrect}>
        <h2>
          <label>{answer.answer}: </label>
          <span>TODO</span>
        </h2>
      </li>
    });

    return <ul className="quiz-questions">{scoreBreakdown}</ul>;
  }

  get renderScores() {
    return <div className="playerScores">
      <h1>Leaderboard</h1>
      <div className="top"><ul>{this.renderTopPlayerScores}</ul></div>
      <div className="non-top"><ul>{this.renderPlayerScores}</ul></div>
    </div>;
  }

  get renderTopPlayerScores() {
    const topPlayers = this.state.topPlayers;

    return topPlayers.map((player, index) => {
      return <li key={'top-player-'+index}>
        <div><Gravatar email={player.email} default="robohash" size={250}></Gravatar></div>
        <div><h3>{player.name}</h3></div>
        <div><h4>{player.score}</h4></div>
      </li>;
    });
  }

  get renderPlayerScores() {
    const players = this.state.players;

    return players.map((player, index) => {
      return <li key={'non-top-player-'+index}>
        <div><Gravatar email={player.email} default="robohash" size={50}></Gravatar></div>
        <div><h3>{player.name}</h3></div>
        <div><h4>{player.score}</h4></div>
      </li>;
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