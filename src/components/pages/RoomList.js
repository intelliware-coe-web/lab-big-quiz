import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import { firebase } from '../../firebase';

const RoomListPage = () =>
  <div>
    <h1>Room List</h1>
    <RoomList/>
  </div>

class RoomList extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
      rooms: [],
      fetched: false
    }
  }

  componentDidMount () {
    var page = this;
    firebase.firestore
            .collection("rooms")
            .get()
            .then(function(querySnapshot) {
              var rooms = []
              querySnapshot.forEach(function(doc) {
                rooms.push({id: doc.id, name: doc.data().name});
              });
              page.setState({
                'rooms': rooms,
                'fetched': true
              });
            })
  }

  get renderRoomItems() {
    const rooms = this.state.rooms;
    return rooms.map((room, index) => {
      return <li key={room.id}>{room.name}<Link to={'/rooms/' + room.id + '/controls'}>Controls</Link><Link to={'/rooms/' + room.id + '/present'}>Present</Link></li>
    });
  }

  get showRooms() {
    if (!this.state.fetched || this.state.rooms.length === 0) {
      return null;
    }

    return <ul>{this.renderRoomItems}</ul>;
  }

  handleJoin() {
    alert('Join Room');
  }

  render() {
    return (
      <div>
        {this.showRooms}
      </div>
    );
  }
}

export default RoomListPage;