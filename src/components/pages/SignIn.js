import React from 'react';
import { withRouter } from 'react-router-dom';
import GoogleSignIn from '../auth/GoogleSignIn';

const SignInPage = ({ history }) =>
  <div>
    <h1>SignIn</h1>
    <h3>Google Sign In</h3>
    <GoogleSignIn history={history} />
  </div>

export default withRouter(SignInPage);