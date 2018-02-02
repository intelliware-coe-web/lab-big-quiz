import React, {Component} from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase'
import ReactFireMixin from 'reactfire'
import reactMixin from 'react-mixin'

const RoomListPage = () =>
  <div>
    <h1>Room List</h1>
    <RoomList/>
  </div>

class RoomList extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
      rooms: []
    }
  }

  componentDidMount () {
    var ref = firebase.database().ref("rooms");
    this.bindAsArray(ref, 'rooms');
  }

  showRooms(room) {
    return <li>{room.name} <button onClick={this.handleJoin}>Join</button></li>
  }

  handleJoin() {
    alert('Join Room');
  }

  render() {
    return (
      <ul>
      {this.state.rooms.map((room, idx) => {
        return this.showRooms(room)
      })}
      </ul>
    );
  }
}

reactMixin(RoomList.prototype, ReactFireMixin)

export default RoomListPage;