import React from 'react';
import PreviousButton from '../controls/PreviousButton';
import NextButton from '../controls/NextButton';
import ShowAnswerButton from '../controls/ShowAnswerButton';
import ShowScoresButton from '../controls/ShowScoresButton';
import ResetButton from '../controls/ResetButton';

import './RoomControls.css';

const RoomControlsPage = ({match}) =>
  <div>
    <h1>Room Controls</h1>

    <div>
      <PreviousButton room-id={match.params.roomId}/>
      <NextButton room-id={match.params.roomId}/>
      <ShowAnswerButton room-id={match.params.roomId}/>
      <ShowScoresButton room-id={match.params.roomId}/>
      <ResetButton room-id={match.params.roomId}></ResetButton>
    </div>
  </div>

export default RoomControlsPage;
