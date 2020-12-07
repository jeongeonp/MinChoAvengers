import React from 'react';
import '../App.css';
import lecture from "../images/lecture.png";
import slide1 from "../images/astronomy_lecture/IMG_00001.jpeg"
import slide2 from "../images/astronomy_lecture/IMG_00002.jpeg"
import slide3 from "../images/astronomy_lecture/IMG_00003.jpeg"
import slide4 from "../images/astronomy_lecture/IMG_00004.jpeg"
import slide5 from "../images/astronomy_lecture/IMG_00005.jpeg"
import slide6 from "../images/astronomy_lecture/IMG_00006.jpeg"
import slide7 from "../images/astronomy_lecture/IMG_00007.jpeg"
import slide8 from "../images/astronomy_lecture/IMG_00008.jpeg"
import slide9 from "../images/astronomy_lecture/IMG_00009.jpeg"
import slide10 from "../images/astronomy_lecture/IMG_00010.jpeg"
import firebase from 'firebase/app';
import 'firebase/database';
import { requirePropFactory } from '@material-ui/core';
import { Button } from 'semantic-ui-react';


const databaseURL = "https://minchoom-cs473.firebaseio.com"
const db = ['/questions', '/answers']
const upvoted = []



function flagToImg(flagTime) {
  const slide_timestamps = [0, 42, 60, 220, 420, 600, 715, 732, 960, 985, 1153, 1333, 1520, 1680, 1860, 1950, 1990, 2100, 2270, 2460];
  var i = 0;
  while(slide_timestamps[++i] < flagTime);
  //console.log("closest is ", slide_timestamps[--i]);
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
    this.upvotePressed = this.upvotePressed.bind(this);
    this.inputChange = this.inputChange.bind(this);
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
    console.log(dataDict)
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
      // question
      if (index === 0) {
        this.addQuestionTwice(dataDict, res.name)
      }
      // answer
      if (index === 1) {
        this.addAnswerTwice(dataDict, res.name)
        this.findQuestionSession(dataDict, res.name)
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
    console.log(answerInfo, answerId)
    const sessionid = sessionStorage.getItem('sessionID')
    fetch(`${databaseURL+'/sessions/'+sessionid+'/answers/'+answerId}/.json`, {
        method: 'PATCH',
        body: JSON.stringify(answerInfo)
    }).then(res => {
        if (res.status !== 200) {
            throw new Error(res.statusText);
        }
        return res.json();
    }).then((res) => {
      this.props.addParticipationPoint(answerInfo['sessionId'], 10)
    })
  } 

  findQuestionSession = (data, answerId) => {
    fetch(`${databaseURL+'/catchup/questions'}/.json`)
    .then(res => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.json();
    }).then(res => {
      const questionId = Object.keys(res).filter(q => q === data['questionId'])[0]
      this.sendQuestionAlert(res[questionId], data, answerId)
    })
  }

  sendQuestionAlert = (question, answer, answerId) => {
    const newQuestion = question
    newQuestion['answered'] = true
    const currAnsweredSessions = question['answeredSessions'] ? question['answeredSessions'] : []
    newQuestion['answeredSessions'] = currAnsweredSessions + [answer['sessionId']]
    
    const sessionid = question['sessionId']
    const questionid = answer['questionId']
    console.log(databaseURL+'/sessions/'+sessionid+'/questions/'+questionid)
    fetch(`${databaseURL+'/sessions/'+sessionid+'/questions/'+questionid}/.json`, {
      method: 'PATCH',
      body: JSON.stringify(newQuestion)
    }).then(res => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.json();
    }).then(() => {
      this.sendQuestionAlertTwice(newQuestion, questionid)
      console.log(sessionStorage.getItem('sessionID') , question)
      if (sessionStorage.getItem('sessionID') === question['sessionId']) {
        alert('Your question: ' + question['questionText'] + ", has been answered!")
        //this.props.showAlert(question['questionText'])
      }
    })
  }

  sendQuestionAlertTwice = (question, questionid) => {
    fetch(`${databaseURL+'/catchup/questions/'+questionid}/.json`, {
      method: 'PATCH',
      body: JSON.stringify(question)
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
          
          const answers = answer_keys.map((k)=>[res[a][k]['answerText'], res[a][k]['flagId'], res[a][k]['flagLabel'], res[a][k]['liked'], res[a][k]['questionId'], res[a][k]['sessionId'], res[a][k]['time'], res[a][k]['upvotes'], k])
          .sort(function(first, second) {
            return first[6] - second[6];
          })
          //console.log(questions)
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
          sessionId: sessionStorage.getItem('sessionID'),
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
          liked: false,
          questionId: qId,
          sessionId: sessionStorage.getItem('sessionID'),
          time: this.props.time,
          upvotes: 0
        }, 1
    )
    this.setState({
      answerValue: ''
    })
  }

  updateAnswer = (answer, answerId) => {
    console.log(answer)
    return fetch( `${databaseURL+'/catchup/answers/'+answerId}/.json`, {
      method: 'PATCH',
      body: JSON.stringify(answer)
    }).then(res => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.json();
    }).then((res) => {
      console.log("Upvote succesfully sent!")
      this.updateAnswerTwice(answer, res.name)
    })
  }

  updateAnswerTwice(answerInfo, answerId) {
    console.log(answerInfo, answerId)
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

  changeAnswerForm = (e) => {
    this.state.answerValue[e.target.name] = e.target.value
    console.log(this.state.answerValue)
    this.setState({answerValue: this.state.answerValue})
  }

  getHintText(label) {
    if (label === "Notice") {return "What was this notice about?"}
    if (label === "Emphasis") {return "Did the professor emphasize something here?"}
    if (label === "Exclusive Material") {return "What did the professor cover here that is not in the slides?"}
    if (label === "Q&A") {return "What was the question and the professor’s answer?"}
    if (label === "Activity") {return "What did I miss here?"}
  }

  upvotePressed = (a) => {
    if (sessionStorage.getItem('upvotedAnswers') === null) {
      sessionStorage.setItem('upvotedAnswers', [a[8]]); }
    else if (!sessionStorage.getItem('upvotedAnswers').includes(a[8])) {
      a[7] = a[7] + 1;
      this.updateAnswer({
        upvotes: a[7]
      }, a[8]);
      sessionStorage['upvotedAnswers'] += a[8];
    }
  }

  inputChange = (q) => {
    if(document.activeElement === document.getElementById(q)) {
      return this.state.answerValue;
    }
    return '';
  }

  render() {
    const { flagId, flagLabel, time, videoTime } = this.props;
    const { questions, answers, formValue, answerValue, sessionId, asking } = this.state;
    const { formatTime, sendQuestion, handleQuestion, sendAnswer, keyPress, keyPress2, getHintText, changeAnswerForm, upvotePressed, inputChange } = this;
    const imgSrc = flagToImg(time);
    return (
            <chat>
              <main>
                <div className="type">{flagLabel}</div>
                {/* This is where the screenshot image goes */}
                <img className='questionImg' src={imgSrc}  />
                <div style={{color: 'grey'}}>Flagged at {formatTime(time)}</div>
                {questions.length > 0
                ?
                questions.map(q => { return (
                  <div>
                    
                    <div className="q">Q. {q[4]}</div>
                    {answers
                      ?
                      answers.filter(e => e[4] === q[7]).map(a => { return (
                      <div className="a">
                        <div className="answerText">A. {a[0]} <Button className="upvote" color="blue" basic onClick={() => upvotePressed(a)}>▲ {a[7]}</Button></div>
                        
                      </div>
                      )})
                      :
                      null
                    }
                    <textarea type="text" className="textarea2" id={q[7]} value={inputChange(q[7])} onChange={(e) => this.setState({answerValue: e.target.value})} onKeyDown={(e) => keyPress2(e, q[7])} placeholder="Answer the question here."/>
                    <Button type="submit" disabled={!answerValue} onClick={() => sendAnswer(q[7])}>Answer</Button>

                  </div>
                
                )})
                :
                <div style={{color: 'black', marginTop: '10px', fontSize: '1.1em'}}>There is no question for this flag yet.</div>
                }
              </main>
              <form >
                  <textarea className="textarea3" value={formValue} onChange={(e) => this.setState({formValue: e.target.value})} onKeyDown={keyPress} placeholder={getHintText(flagLabel)} />
                  <button type="submit" disabled={!formValue} onClick={sendQuestion}>🕊️</button>
              </form>
              
          </chat>)
    }
};