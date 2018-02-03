import React, {Component} from 'react';
import { Link } from 'react-router-dom'

const RoomListPage = () =>
  <div>
    <h1>Room List</h1>
    <RoomList/>
  </div>

class RoomList extends Component {

  get showRooms() {
    return <li>
      Test 
      <Link to="/rooms/qwerty123456/controls">Controls</Link>
      <Link to="/rooms/qwerty123456/present">Present</Link>
    </li>
  }

  render() {
    return (
      <div>
        <ul>{this.showRooms}</ul>
      </div>
    );
  }
}

export default RoomListPage;