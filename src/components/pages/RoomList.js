import React, {Component} from 'react';
import PropTypes from 'prop-types';

const RoomListPage = () =>
  <div>
    <h1>Room List</h1>
    <RoomList/>
  </div>

class RoomList extends Component {

  get showRooms() {
    return <li>Test <button onClick={this.handleJoin}>Join</button></li>
  }

  handleJoin() {
    alert('Join Room');
  }

  render() {
    return (
      <ul>{this.showRooms}</ul>
    );
  }
}

export default RoomListPage;