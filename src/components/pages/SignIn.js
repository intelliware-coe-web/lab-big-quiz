import React from 'react';
import { withRouter } from 'react-router-dom';

import { SignUpLink } from './SignUp';
import EmailSignIn from '../auth/EmailSignIn';
import GoogleSignIn from '../auth/GoogleSignIn';

const SignInPage = ({ history }) =>
  <div>
    <h1>SignIn</h1>
    <h3>Google Sign In</h3>
    <GoogleSignIn history={history} />
    <h3>Email Sign In</h3>
    <EmailSignIn history={history} />
    <SignUpLink />
  </div>

export default withRouter(SignInPage);