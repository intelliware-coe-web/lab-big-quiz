import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import Navigation from './Navigation';
import LandingPage from './Landing';
import SignInPage from './SignIn';
import SignUpPage from './SignUp';
import HomePage from './Home';
import withAuthentication from './auth/withAuthentication';

import * as routes from '../constants/routes';

const App = () =>
  <Router>
    <div>
      <Navigation />

      <hr/>

      <Route exact path={routes.LANDING} component={() => <LandingPage />} />
      <Route exact path={routes.SIGN_UP} component={() => <SignUpPage />} />
      <Route exact path={routes.SIGN_IN} component={() => <SignInPage />} />
      <Route exact path={routes.HOME} component={() => <HomePage />} />
    </div>
  </Router>

export default withAuthentication(App);