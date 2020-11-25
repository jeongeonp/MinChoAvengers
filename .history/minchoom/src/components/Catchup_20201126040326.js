import React from 'react';
import '../App.css';
import lecture from "../images/lecture.png";

import firebase from 'firebase/app';
import 'firebase/database';

const databaseURL = "https://minchoom-cs473.firebaseio.com"
const db = ['/questions', '/answers']

function flagToImg(flagTime) {
  const slide_timestamps = [0, 42, 60, 220, 420, 600, 715, 732, 960, 985, 1153, 1333, 1520, 1680, 1860, 1950, 1990, 2100, 2270, 2460];
  var closest = slide_timestamps.reduce(function(prev, curr) {
    return (curr >= flagTime && flagTime > prev ? curr : prev);
  })      
  console.log("closest is ", closest);
  return slide_timestamps.indexOf(closest);
}

export default class Catchup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      answers: [],
      formValue: '',
      sessionId: 'julie',
      asking: true
    }
    this.getChatData = this.getChatData.bind(this);
    this.sendData = this.sendData.bind(this);
    this.sendQuestion = this.sendQuestion.bind(this);
  }

  componentDidMount() {
    this.getChatData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.videoTime !== this.props.videoTime){
      this.getChatData()
    }
  }

  sendData = (dataDict, index) => {
    return fetch( `${databaseURL+'/catchup'+ db[index]}/.json`, {
      method: 'POST',
      body: JSON.stringify(dataDict)
    }).then(res => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.json();
    }).then(() => {
      console.log("CatchUp Question succesfully sent!")
    })
  }

  getChatData = () => {
    fetch( `${databaseURL+'/catchup'}/.json`).then(res => {
        if (res.status !== 200) {
            throw new Error(res.statusText);
        }
        return res.json();
    }).then(res => {
        const q = 'questions'
        const a = 'answers'
        const question_keys = Object.keys(res['questions'])
        const answer_keys = Object.keys(res['answers'])
        const questions = question_keys.map((k)=>[res[q][k]['answered'], res[q][k]['answeredSessions'], res[q][k]['flagId'], res[q][k]['flagLabel'], res[q][k]['questionText'], res[q][k]['sessionId'], res[q][k]['time']]).sort(function(first, second) {
            return second[6] - first[6];
          })
        const answers = answer_keys.map((k)=>[res[a][k]['answerText'], res[a][k]['flagId'], res[a][k]['flagLabel'], res[a][k]['liked'], res[a][k]['questionId'], res[a][k]['sessionId'], res[a][k]['time'], res[a][k]['upvotes']]).sort(function(first, second) {
          return second[6] - first[6];
        })
        this.setState({
          questions: questions,
          answers: answers
        })
    })
  }

  sendQuestion = async (e) => {
    e.preventDefault();

    this.sendData(
        {
          answered: false,
          answeredSessions: [],
          flagId: this.props.flagId,
          flagLabel: this.props.flagLabel,
          questionText: this.state.formValue,
          sessionId: this.state.sessionId,
          //sessionId: "pat",
          time: this.props.time,
        }, 0
    )
    this.setState({
      formValue: '',
      asking: true
    })
  }

  sendAnswer = async (e) => {
    e.preventDefault();

    this.sendData(
        {
          answerText: false,
          flagId: this.props.flagId,
          flagLabel: this.props.flagLabel,
          liked:false,
          questionId: '',
          sessionId: this.state.sessionId,
          //sessionId: "pat",
          time: new Date(),
          upvotes: 0
        }, 1
    )
    this.setState({
      formValue: ''
    })
    //dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  handleQuestion = () => {
      this.setState({
        asking: false
      })
  }


  render() {
    const { flagTime} = this.props;
    const {questions, answers, formValue, sessionId, asking} = this.state;
    const { sendQuestion, handleQuestion, sendAnswer } = this;
    const imgIndex = flagToImg(flagTime);
    return (
            <chat>
              <main>
                <div className="type">
                    Notice    
                </div>
                {/* This is where the screenshot image goes */}
                <img className='questionImg' src={`../../public/cs231n_2017_lecture16-${}.png`}  />
                <div>{questions.filter((q) => q.flagId == this.props.flagId)
                    ?
                    questions.filter((q) => q.flagId == this.props.flagId).map(q => { return(
                    <>
                    <div className='question'onClick={handleQuestion}>
                    <div className="q">Q. {q[4]}</div>
                    </div></>)})
                    :
                    <div>no questions!</div>  
                }</div>
                <div>{answers 
                    ?
                    answers.map(a => { return(
                    <>
                    <div>
                    <div className="a">A. {a[0]}</div>
                    </div></>)})
                    :
                    <div>no answers!</div>  
                    }
                </div>
              
                {/* <span ref={dummy}></span> */}
              </main>
          
              <form onSubmit={asking ? sendQuestion: sendAnswer}>
                  
                  <textarea value={formValue} onChange={(e) => this.setState({formValue: e.target.value})} placeholder="Ask your question!" />
            
                  <button type="submit" disabled={!formValue}>🕊️</button>
            
              </form>
          </chat>)
          }
};