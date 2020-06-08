import React from "react";
import axios from 'axios';


let url = "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
class App extends React.Component {
  state = {
    currentQuestion: 0,
    questions: "",
    myAnswer: null,
    options: [],
    score: 0,
    isEnd: false,
    isStart: false,
    quizData: []
  };


  fetchData = () => {
    axios.get(url)
      .then(res => {
        const quizData = []
        res.data.results.forEach(element => {
          let options = [...element.incorrect_answers, element.correct_answer]
          options.sort(() => { return Math.random() - 0.5 })
          quizData.push({
            question: element.question,
            options: options,
            correct_answer: element.correct_answer
          })

        })
        this.setState({ quizData })

      })
      .catch(err => console.log(err))

  }
  componentDidMount() {
    this.fetchData()
  }
  nextQuestionHandler = () => {
    const { myAnswer, score } = this.state;
    const correct_answer = this.state.quizData[this.state.currentQuestion].correct_answer
    if (myAnswer === correct_answer) {
      this.setState({
        score: score + 1
      });
    }
    this.setState({
      currentQuestion: this.state.currentQuestion + 1
    });
  };

  checkAnswer = answer => {
    this.setState({ myAnswer: answer });
  };

  finishHandler = () => {
    if (this.state.currentQuestion === this.state.quizData.length - 1) {
      this.setState({
        isEnd: true
      });
    }
  };

  playAgainHandler = () => {

    // do it
    this.setState({
      currentQuestion: 0,
      myAnswer: null,
      options: [],
      score: 0,
      isEnd: false,
    })
    this.fetchData();
  }
  startTrivia = () => {
    this.setState({
      isStart: true
    })
  }
  turnHomeHandler = () =>{
    this.setState({
      currentQuestion: 0,
      myAnswer: null,
      options: [],
      score: 0,
      isEnd: false,
      isStart : false
    })
    this.fetchData();
  }
  
  render() {


    if (typeof this.state.quizData[0] === 'undefined') {
      return <div>Fetching data ...</div>
    }
    else {
      const { options, myAnswer, currentQuestion, isEnd, isStart } = this.state;

      if (isStart === false) {
        return(
        <div className="container">
          <h3>Trivia Quiz </h3>
          <button className="btn btn-success" onClick={this.startTrivia}>
            Start
          </button>
        </div>
        );
      } else {
        if (isEnd) {
          return (
            <div className="container">
              <h3>Game Over ! Your final score is {this.state.score} points </h3>
              {/* play again butonu eklenecek */}
              <button className="btn btn-success" onClick={this.playAgainHandler}>
                Play Again
          </button>
          <button className="btn btn-success" onClick={this.turnHomeHandler} >
          
          Menu</button>
            </div>
          );
        } else {
          return (
            <div className="container">

              <h1 className="bg-danger">{`Question ${currentQuestion + 1} : ${this.state.quizData[this.state.currentQuestion].question} `}</h1>
              <hr />
              {/* options eklenilecek */}
              <p className="bg-info"> Options</p>
              {/* <kbd></kbd> */}
              {this.state.quizData[this.state.currentQuestion].options.map(option => (

                <p>
                  <button className={`btn btn-info`}
                    onClick={() => this.checkAnswer(option)} >
                    {option}
                  </button>
                </p>
              ))}
              <hr />
              {currentQuestion < this.state.quizData.length - 1 && (
                <button className="btn btn-primary" onClick={this.nextQuestionHandler}> Next
                </button>
              )}
              {/* //finish button eklenilecek */}

              {currentQuestion === this.state.quizData.length - 1 && (
                <button className="btn btn-danger" onClick={this.finishHandler}>Finish
                </button>
              )}
            </div>
          );
        }
      }
    }
  }
}

export default App;

