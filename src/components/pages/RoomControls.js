import React, { Component } from 'react';
import PropTypes from 'prop-types';

const RoomControlsPage = () =>
  <div>
    <h1>Room Controls</h1>

    <div>
      <PreviousButton/>
      <NextButton/>
    </div>

    <div>
      <QuizSetupForm/>
    </div>
  </div>


class PreviousButton extends Component {
  handleClick(event) {
    alert('Previous was clicked');
  }

  render() {
    return (
      <button onClick={this.handleClick}>Previous</button>
    );
  }
}

class NextButton extends Component {
  handleClick(event) {
    alert('Next was clicked');
  }

  render() {
    return (
      <button onClick={this.handleClick}>Next</button>
    );
  }
}

class QuizSetupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Questions go here.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An data was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Questions:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default RoomControlsPage;

export {
  QuizSetupForm,
  PreviousButton,
  NextButton
};