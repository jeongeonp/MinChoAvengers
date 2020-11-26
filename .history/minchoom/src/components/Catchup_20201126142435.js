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
  switch (i) {
    case 0:
      return slide1;
    case 1:
      return slide2;
    case 2:
      return slide3;
    case 3:
      return slide4;
    case 4:
      return slide5;
    case 5:
      return slide6;
    case 6:
      return slide7;
    case 7:
      return slide8;
    case 8:
      return slide9;
    case 9:
      return slide10;

  }
  return i;
}

export default class Catchup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      answers: [],
      formValue: '',
      answerValue: [],
      sessionId: sessionStorage.getItem('sessionID'),
      asking: true,

      tempImage: '',
      tempQuestions: [],
      tempAnswers: [],
    }
    this.formatTime = this.formatTime.bind(this);
    this.getQuestionAnswerData = this.getQuestionAnswerData.bind(this);
    this.sendData = this.sendData.bind(this);
    this.addQuestionTwice = this.addQuestionTwice.bind(this);
    this.addAnswerTwice = this.addAnswerTwice.bind(this);
    this.sendQuestion = this.sendQuestion.bind(this);
    this.sendAnswer = this.sendAnswer.bind(this);
    this.keyPress = this.keyPress.bind(this);
  }

  componentDidMount() {
    this.getQuestionAnswerData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.videoTime !== this.props.videoTime){
      this.getQuestionAnswerData()
    }
  }


  formatTime(time) {
    time = Math.round(time);
  
    var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ":" + seconds;
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
      console.log("CatchUp " + index + " succesfully sent!")
      if (index === 0) {
        // question
        this.addQuestionTwice(dataDict, res.name)
      }
      if (index === 1) {
        // answer
        this.addAnswerTwice(dataDict, res.name)
        console.log(dataDict)
      }

    })
  }

  addQuestionTwice(questionInfo, questionId) {
    const sessionid = this.props.sessionId
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
    console.log(answerInfo, answerId)
    const sessionid = this.props.sessionId
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

  getQuestionAnswerData = () => {
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
          const answer_keys = res['answers'] ? Object.keys(res['answers']) : []
          const questions = question_keys.map((k)=>[res[q][k]['answered'], res[q][k]['answeredSessions'], res[q][k]['flagId'], res[q][k]['flagLabel'], res[q][k]['questionText'], res[q][k]['sessionId'], res[q][k]['time'], k])
          .filter(e => (e[2]===this.props.flagId)).sort(function(first, second) {
              return first[6] - second[6];
            })
          
          const answers = answer_keys.map((k)=>[res[a][k]['answerText'], res[a][k]['flagId'], res[a][k]['flagLabel'], res[a][k]['liked'], res[a][k]['questionId'], res[a][k]['sessionId'], res[a][k]['time'], res[a][k]['upvotes']])
          .sort(function(first, second) {
            return first[6] - second[6];
          })
          console.log(answers)
          /*
          const answerDict = []
          for (var answer in allAnswers) {
            if ()
          }*/
          console.log(answers)
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
          sessionId: this.props.sessionId,
          time: this.props.time,
        }, 0
    )
    this.setState({
      formValue: '',
      asking: true
    })
  }

  sendAnswer = (qId) => {
    console.log(qId)
    this.sendData(
        {
          answerText: this.state.answerValue,
          flagId: this.props.flagId,
          flagLabel: this.props.flagLabel,
          liked:false,
          questionId: qId,
          sessionId: this.props.sessionId,
          time: this.props.time,
          upvotes: 0
        }, 1
    )
    this.setState({
      answerValue: ''
    })
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
    }
  }

  keyPress2 = (e, qId) => {
    if(e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      
      this.sendAnswer(qId)
      
    }
  }

  getHintText(label) {
    if (label === "Notice") {return "What was this notice about?"}
    if (label === "Emphasis") {return "Did the professor emphasize something here?"}
    if (label === "Exclusive Material") {return "What did the professor cover here that is not in the slides?"}
    if (label === "Q&A") {return "What was the question and the professor’s answer?"}
    if (label === "Activity") {return "What did I miss here?"}
  }

  render() {
    const { flagId, flagLabel, time, videoTime, flagTime } = this.props;
    const { questions, answers, formValue, answerValue, sessionId, asking } = this.state;
    const { formatTime, sendQuestion, handleQuestion, sendAnswer, keyPress, keyPress2, getHintText } = this;
    const imgSrc = flagToImg(flagTime);
    return (
            <chat>
              <main>
                <div className="type">{flagLabel}</div>
                {/* This is where the screenshot image goes */}
                <img className='questionImg' src={imgSrc}  />
                <div style={{color: 'grey'}}>Flagged at {formatTime(time)}</div>
                {questions.map(q => { return (
                  <div>
                    <div className="q">Q. {q[4]}</div>
                    {answers
                      ?
                      answers.filter(e => e[4] == q[7]).map(a => { return (
                      <div className="a">A. {a[0]}</div>
                      )})
                      :
                      null
                    }
                    <textarea type="text" className="textarea2" value={answerValue} onChange={(e) => this.setState({answerValue: e.target.value})} onKeyDown={() => keyPress2(q[7])} placeholder="Answer the question here."/>
                    <button type="submit" disabled={!answerValue} onClick={() => sendAnswer(q[7])}>Answer</button>

                  </div>
                )})}
                {/*
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
                  */}
              
              </main>
              <form >
                  <textarea value={formValue} onChange={(e) => this.setState({formValue: e.target.value})} onKeyDown={keyPress} placeholder={getHintText(flagLabel)} />
                  <button type="submit" disabled={!formValue} onClick={sendQuestion}>🕊️</button>
              </form>
          </chat>)
          }
};