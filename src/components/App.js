import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import withAuthentication from './auth/withAuthentication';

import RoomListPage from './pages/RoomList';
import RoomControlsPage from './pages/RoomControls';
import RoomLeaderboardPage from './pages/RoomLeaderboard'
import RoomScoreBreakdownPage from './pages/RoomLeaderboard';
import RoomPresentPage from './pages/RoomPresent';

import JoinRoomPage from './pages/JoinRoom';
import QuizPage from './pages/Quiz';

import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';

import * as routes from '../constants/routes';

import './App.css';

const App = () =>
  <Router forceRefresh={true}>
    <div>
      <Route exact path={routes.ROOM_LIST} component={ RoomListPage }/>
      <Route exact path={routes.ROOM_CONTROLS} component={ RoomControlsPage } />
      <Route exact path={routes.ROOM_LEADERBOARD} component={ RoomLeaderboardPage } />
      <Route exact path={routes.ROOM_PRESENT} component={ RoomPresentPage } />
      <Route exact path={routes.ROOM_SCORE_BREAKDOWN} component={ RoomScoreBreakdownPage } />

      <Route exact path={routes.JOIN_ROOM} component={ JoinRoomPage } />
      <Route exact path={routes.QUIZ} component={ QuizPage } />

      <Route exact path={routes.SIGN_UP} component={() => <SignUpPage />} />
      <Route exact path={routes.SIGN_IN} component={() => <SignInPage />} />
    </div>
  </Router>

export default withAuthentication(App);