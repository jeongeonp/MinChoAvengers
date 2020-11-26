import React from 'react';
import '../App.css';
import lecture from "../images/lecture.png";
import slide1 from "../images/cs231n_2017_lecture16/40EA23FD1.jpeg"
import slide2 from "../images/cs231n_2017_lecture16/40EA23FD2.jpeg"
import slide3 from "../images/cs231n_2017_lecture16/40EA23FD3.jpeg"
import slide4 from "../images/cs231n_2017_lecture16/40EA23FD4.jpeg"
import slide5 from "../images/cs231n_2017_lecture16/40EA23FD5.jpeg"
import slide6 from "../images/cs231n_2017_lecture16/40EA23FD6.jpeg"
import slide7 from "../images/cs231n_2017_lecture16/40EA23FD7.jpeg"
import slide8 from "../images/cs231n_2017_lecture16/40EA23FD8.jpeg"
import slide9 from "../images/cs231n_2017_lecture16/40EA23FD9.jpeg"
import slide10 from "../images/cs231n_2017_lecture16/40EA23FD10.jpeg"
import firebase from 'firebase/app';
import 'firebase/database';
import { requirePropFactory } from '@material-ui/core';

const databaseURL = "https://minchoom-cs473.firebaseio.com"
const db = ['/questions', '/answers']



function flagToImg(flagTime) {
  const slide_timestamps = [0, 42, 60, 220, 420, 600, 715, 732, 960, 985, 1153, 1333, 1520, 1680, 1860, 1950, 1990, 2100, 2270, 2460];
  var i = 0;
  while(slide_timestamps[++i] < flagTime);
  console.log("closest is ", slide_timestamps[--i]);
  return i;
}

export default class Catchup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      answers: [],
      formValue: '',
      sessionId: sessionStorage.getItem('sessionID'),
      asking: true,

      tempImage: '',
      tempQuestions: [],
      tempAnswers: [],
    }
    this.getChatData = this.getChatData.bind(this);
    this.sendData = this.sendData.bind(this);
    this.addQuestionTwice = this.addQuestionTwice.bind(this);
    this.addAnswerTwice = this.addAnswerTwice.bind(this);
    this.sendQuestion = this.sendQuestion.bind(this);
    this.sendAnswer = this.sendAnswer.bind(this);
    this.keyPress = this.keyPress.bind(this);
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
    }).then((res) => {
      console.log("CatchUp Question succesfully sent!")
      if (index === 0) {
        // question
        this.addQuestionTwice(dataDict, res.name)
      }
      if (index === 1) {
        // answer
        this.addAnswerTwice(dataDict, res.name)
      }

    })
  }

  addQuestionTwice(questionInfo, questionId) {
    const sessionid = sessionStorage.getItem('sessionID')
    fetch(`${databaseURL+'/sessions/'+sessionid+'/questions/'+questionId}/.json`, {
        method: 'PATCH',
        body: JSON.stringify(questionInfo)
    }).then(res => {
        if (res.status !== 200) {
            throw new Error(res.statusText);
        }
        return res.json();
    })
  }

  addAnswerTwice(answerInfo, answerId) {
    const sessionid = sessionStorage.getItem('sessionID')
    fetch(`${databaseURL+'/sessions/'+sessionid+'/answers/'+answerId}/.json`, {
        method: 'PATCH',
        body: JSON.stringify(answerInfo)
    }).then(res => {
        if (res.status !== 200) {
            throw new Error(res.statusText);
        }
        return res.json();
    })
  } 

  getChatData = () => {
    fetch( `${databaseURL+'/catchup'}/.json`)
    .then(res => {
        if (res.status !== 200) {
            throw new Error(res.statusText);
        }
        return res.json();
    }).then(res => {
        if (res) {
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
        }
        
    })
  }

  sendQuestion = async (e) => {
    this.sendData(
        {
          answered: false,
          answeredSessions: [],
          flagId: this.props.flagId,
          flagLabel: this.props.flagLabel,
          questionText: this.state.formValue,
          sessionId: this.state.sessionId,
          time: this.props.time,
        }, 0
    )
    this.setState({
      formValue: '',
      asking: true
    })
  }

  sendAnswer = async (e) => {
    this.sendData(
        {
          answerText: false,
          flagId: this.props.flagId,
          flagLabel: this.props.flagLabel,
          liked:false,
          questionId: '',
          sessionId: this.state.sessionId,
          time: this.props.time,
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

  keyPress = e => {
    if(e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      if (this.state.asking) {
        this.sendQuestion()
      }
      else {
        this.sendAnswer()
      }
    }
  }

  getHintText(label) {
    if (label === "Activity") {return "What was this notice about?"}
    if (label === "Activity") {return "What was this notice about?"}
    if (label === "Activity") {return "What was this notice about?"}
    if (label === "Activity") {return "What was this notice about?"}
    if (label === "Activity") {return "What was this notice about?"}
  }

  render() {
    const { flagTime, flagLabel} = this.props;
    const imgIndex = flagToImg(flagTime);
    const {questions, answers, formValue, sessionId, asking} = this.state;
    const { sendQuestion, handleQuestion, sendAnswer, keyPress } = this;
    return (
            <chat>
              <main>
                <div className="type">
                    {flagLabel}    
                </div>
                {/* This is where the screenshot image goes */}
                <img className='questionImg' src={require(`../images/cs231n_2017_lecture16/40EA23FD${imgIndex}.jpeg`)}  />
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
              
              </main>
              <form >
                  <textarea value={formValue} onChange={(e) => this.setState({formValue: e.target.value})} onKeyDown={keyPress} placeholder="Ask your question!" />
                  <button type="submit" disabled={!formValue} onClick={asking ? sendQuestion: sendAnswer}>🕊️</button>
              </form>
          </chat>)
          }
};