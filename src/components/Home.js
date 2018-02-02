import React from 'react';
import PropTypes from 'prop-types';

const HomePage = () =>
  <div>
    <h1>Home Page</h1>
  </div>

HomePage.contextTypes = {
  authUser: PropTypes.object,
};

export default HomePage;