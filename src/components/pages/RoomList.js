import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import { firebase } from '../../firebase';

const RoomListPage = () =>
  <div>
    <h1>Room List</h1>
    <RoomList presenter/>
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

  get renderRoomItemsAsPresenter() {
    const rooms = this.state.rooms;
    return rooms.map((room, index) => {
      return <li className="room-info" key={room.id}>{room.name}
        <Link to={'/rooms/' + room.id + '/controls'}>Controls</Link>
        <Link to={'/rooms/' + room.id + '/present'}>Present</Link>
      </li>
    });
  }

  get renderRoomItemsAsUser() {
    const rooms = this.state.rooms;
    return rooms.map((room, index) => {
      return <li className="room-info" key={room.id}>{room.name}
        <Link to={'/quiz/' + room.id}>Join</Link>
      </li>
    });
  }

  get showRooms() {
    if (!this.state.fetched || this.state.rooms.length === 0) {
      return null;
    }

    if (this.props.presenter) {
      return <ul>{this.renderRoomItemsAsPresenter}</ul>;
    } else {
      return <ul>{this.renderRoomItemsAsUser}</ul>;
    }    
  }

  render() {
    return (
      <div>
        {this.showRooms}
      </div>
    );
  }
}

export { RoomList};
export default RoomListPage;