import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import SignOutButton from './auth/SignOut';
import * as routes from '../constants/routes';

const Navigation = (props, { authUser }) =>
  <div>
    { authUser
        ? <NavigationAuth />
        : <NavigationNonAuth />
    }
  </div>

Navigation.contextTypes = {
  authUser: PropTypes.object,
};

const NavigationAuth = () =>
  <ul>
    <li><Link to={routes.ROOM_LIST}>Room List</Link></li>
    <li><Link to={routes.ROOM_CONTROLS}>Room Controls</Link></li>
    <li><Link to={routes.ROOM_LEADERBOARD}>Room Leadboard</Link></li>
    <li><Link to={routes.ROOM_PRESENT}>Room Presentation</Link></li>
    <li><Link to={routes.ROOM_SCORE_BREAKDOWN}>Room Score Breakdown</Link></li>

    <li><Link to={routes.JOIN_ROOM}>Join Room</Link></li>
    <li><Link to={routes.QUIZ}>Quiz</Link></li>

    <li><SignOutButton /></li>
  </ul>

const NavigationNonAuth = () =>
  <ul>
    <li><Link to={routes.SIGN_IN}>SIGN_IN</Link></li>
  </ul>

export default Navigation;