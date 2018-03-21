import React from 'react';
import { withRouter } from 'react-router-dom';

import { SignUpLink } from './SignUp';
import EmailSignIn from '../auth/EmailSignIn';
import GoogleSignIn from '../auth/GoogleSignIn';

const SignInPage = ({ history }) =>
  <div>
    <h1>Intelliware Web Coe Big Web Quiz</h1>
    <hr/>
    <h3>Google Sign In</h3>
    <GoogleSignIn history={history} />
    <hr/>
    <h3>Email Sign In</h3>
    <EmailSignIn history={history} />
    <SignUpLink />
  </div>

export default withRouter(SignInPage);