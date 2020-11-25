import React from 'react';
import '../App.css';
import lecture from "../images/lecture.png";

import firebase from 'firebase/app';
import 'firebase/database';

const databaseURL = "https://minchoom-cs473.firebaseio.com"

export default class Catchup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      answers: [],
      formValue: '',
      sessionId: 'julie'

    }
    this.sendData = this.sendData.bind(this);
    this.getData = this.getData.bind(this);
    this.sendQuestion = this.sendQuestion.bind(this);
  }

  componentDidMount() {
    this.getData();
    // firebase
    //   .database()
    //   .ref("/catchup")
    //   .on("value", snapshot =>
    //     this.getData
    //   );
  }

  sendData = (dataDict) => {
    return fetch( `${databaseURL+'/catchup'}/.json`, {
      method: 'POST',
      body: JSON.stringify(dataDict)
    }).then(res => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.json();
    }).then(() => {
      console.log("CatchUp succesfully sent!")
    })
  }

  getData = () => {
    fetch( `${databaseURL+'/catchup'}/.json`).then(res => {
        if (res.status !== 200) {
            throw new Error(res.statusText);
        }
        return res.json();
    }).then(res => {
        const question_keys = Object.keys(res['questions'])
        const answer_keys = Object.keys(res['answers'])
        const questions = question_keys.map((k)=>[res['questions'][k]['answered'], res['questions'][k]['answeredSessions'], res['questions'][k]['flagId'], res['questions'][k]['questionId'], res['questions'][k]['questionText'], res['questions'][k]['sessionId'], res['questions'][k]['time']]).sort(function(first, second) {
            return second[6] - first[6];
          })
        const answers = answer_keys.map((k)=>[res['answers'][k]['answerId'], res['answers'][k]['answerText'], res['answers'][k]['flagId'], res['answers'][k]['liked'], res['answers'][k]['questionId'], res['answers'][k]['sessionId'], res['answers'][k]['time'], res['answers'][k]['upvotes']]).sort(function(first, second) {
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
          answeredSessions: '',
          flagId: 1,
          questionId: 1,
          questionText: this.state.formValue,
          sessionId: this.state.sessionId,
          //sessionId: "pat",
          time: new Date()
        }
    )
    this.setState({
      formValue: ''
  })
    //dummy.current.scrollIntoView({ behavior: 'smooth' });
  }


  render() {
    const { } = this.props;
    const {questions, answers, formValue, sessionId} = this.state;
    const { sendQuestion } = this;
    return (
            <chat>
              <main>
                <div className="type">
                    Notice    
                </div>
                <div>{questions 
                ?
                questions.map(q => { return(
                <>
                <div className='question'>
                {/* This is where the screenshot image goes */}
                  <img className='questionImg' src={lecture} />
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
                  <div className="a">A. {a[1]}</div>
                </div></>)})
                :
                <div>no answers!</div>  
                }

                </div>
              
                {/* <span ref={dummy}></span> */}
              </main>
          
              <form onSubmit={sendQuestion}>
                  
                  <textarea value={formValue} onChange={(e) => this.setState({formValue: e.target.value})} placeholder="Ask your question!" />
            
                  <button type="submit" disabled={!formValue}>🕊️</button>
            
                </form>
          </chat>)
          }
};