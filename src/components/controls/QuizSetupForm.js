import WithQuizState from './WithQuizState';
import { firebase } from '../../firebase';

class QuizSetupForm extends WithQuizState {
  
  constructor(props) {
    super(props);
    this.state = {
      questions: []
    };
  }

  componentDidUpdate(prevProps, prevState) {
    var vm = this;

    if (this.state.roomId && this.state.roomId !== prevState.roomId) {
      firebase.firestore
              .collection('rooms')
              .doc(this.state.roomId)
              .collection('questions')
              .onSnapshot(function(querySnapshot) {
                var questions = [];
                querySnapshot.forEach(function(doc) {
                  questions.push({
                    id: doc.id,
                    number: doc.data().number,
                    question: doc.data().question
                  })
                });
                vm.setState({questions: questions});
              });
    }
  }


  updateQuestion(event) {
    event.preventDefault();    
  }

  handleSubmit(text) {
    return function(event) {
      event.preventDefault()
      console.log(text)
    }.bind(this)
  }
  
  
  renderQuestion(question) {
    return (
      <form onSubmit={this.handleSubmit(question)}>
        <label>Question:</label>
        <textarea type="text" value={question.question}/>        
        <input type="submit" value="Submit" />
      </form>
    );
  }

  get renderQuestionForm() {
    const questions = this.state.questions;
    return questions.map((question, index) => {
      return <div>{this.renderQuestion(question)}</div>
    });
  }

  render() {
    return (
      <div>
        {this.renderQuestionForm}
      </div>      
    );
  }
}

  export default QuizSetupForm