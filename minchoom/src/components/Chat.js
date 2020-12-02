import React from 'react';
import '../App.css';
import ketchup from '../images/ketchup.png';
import mustard from "../images/mustard.png";
import profile from "../images/profile.png";

import firebase from 'firebase/app';
import 'firebase/database';

// firebase.initializeApp({
//   apiKey: "AIzaSyAbSi5-Zo17vSZzCTEM3N0_LigxJ-FP_1g",
//   authDomain: "minchoom-cs473.firebaseapp.com",
//   databaseURL: "https://minchoom-cs473.firebaseio.com",
//   projectId: "minchoom-cs473",
//   storageBucket: "minchoom-cs473.appspot.com",
//   messagingSenderId: "408648982373",
//   appId: "1:408648982373:web:4fa501aa75ec79501b0b8c",
//   measurementId: "G-Y0J1GG0TE2"
// });

const databaseURL = "https://minchoom-cs473.firebaseio.com"

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      formValue: '',
      sessionId: sessionStorage.getItem('sessionID'),

    }
    this.sendData = this.sendData.bind(this);
    this.getChatData = this.getChatData.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidMount() {
    this.getChatData();
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.videoTime !== this.props.videoTime){
      this.getChatData()
    }
    if (prevState.messages !== this.state.messages){
      this.scrollToBottom();
    }
  }

  sendData = (dataDict) => {
    return fetch( `${databaseURL+'/chatroom'}/.json`, {
      method: 'POST',
      body: JSON.stringify(dataDict)
    }).then(res => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.json();
    }).then(() => {
      console.log("Chatroom succesfully sent!")
    })
  }

  getChatData = () => {
    //console.log(this.props.videoTime)
    fetch( `${databaseURL+'/chatroom'}/.json`).then(res => {
        if (res.status !== 200) {
            throw new Error(res.statusText);
        }
        return res.json();
    }).then(res => {
        if (res) {
          const keys = Object.keys(res)
          const chats = keys.map((k)=>[res[k]['time'], res[k]['sessionId'], res[k]['messageText'], res[k]['sessionName']])
          .filter(e => (e[0]<=this.props.videoTime)).sort(function(first, second) {
            return first[0] - second[0];
          })
          if (this.state.messages.length !== chats.length) {
            this.setState({
              messages: chats
            })
          }
          
        }
        
    })
  }

  formatTime(time) {
    time = Math.round(time);
  
    var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ":" + seconds;
  }


  keyPress = e => {
    if(e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage = async (e) => {
    //e.preventDefault();

    this.sendData(
        {
          messageText: this.state.formValue,
          sessionId: this.state.sessionId,
          time: this.props.videoTime,
          sessionName: sessionStorage.getItem('sessionName')
        }
    )
    this.setState({
      formValue: ''
  })
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }


  render() {
    const { videoTime } = this.props;
    const { messages, formValue, sessionId } = this.state;
    const { sendMessage, keyPress, scrollToBottom } = this;
    return (
            <div className="chat">
              <main>
                <div>
                  {messages 
                  ?
                  messages.map(msg => { return (
                    <>
                    {this.state.sessionId !== msg[1] && <div style={{color: '#444444', margin: '3px 14px 0px', textAlign: 'left'}}>{msg[3]}</div>}
                    <div className={`message ${this.state.sessionId === msg[1] ? 'sent' : 'received'}`}>
                      <img src={profile} />
                      <p>{msg[2]}</p>
                      <span style={{color: 'grey', padding: '4px 7px 0 7px'}}>{this.formatTime(msg[0])}</span>
                    </div>
                    </>
                  )})
                  :
                  <div>no messages</div>  
                  }
                </div>
                <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }}/>
              </main>
              <form ref={el => this.myFormRef = el}>
                  <textarea value={formValue} onChange={(e) => this.setState({formValue: e.target.value})} onKeyDown={keyPress} placeholder=" Type in anything!" />
                  <button type="submit" disabled={!formValue} onClick={sendMessage}>🕊️</button>
                </form>
          </div>)
    }
};