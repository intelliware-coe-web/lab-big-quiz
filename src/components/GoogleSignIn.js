import React, { Component } from 'react';

import { auth } from '../firebase';
import * as routes from '../constants/routes';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class GoogleSignIn extends Component {

  googleSignIn(event) {  
    const {
      history,
    } = this.props;

    auth.doSignInWithGoogle()
      .then(() => {
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });    
  }

  render() {
    return (
      <button onClick={() => this.googleSignIn()}>
        Google Sign In
      </button>
    );
  }
}

export default GoogleSignIn;