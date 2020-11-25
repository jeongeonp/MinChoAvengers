import React from 'react';
import '../App.css';
import ketchup from '../ketchup.png';
import mustard from "../mustard.png";
import profile from "../profile.png";

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
      sessionId: 'julie'
    }
    this.sendData = this.sendData.bind(this);
    this.getData = this.getData.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    this.getData();
    // firebase
    //   .database()
    //   .ref("/chatroom")
    //   .on("value", snapshot =>
    //     this.getData
    //   );
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

  getData = () => {
    fetch( `${databaseURL+'/chatroom'}/.json`).then(res => {
        if (res.status !== 200) {
            throw new Error(res.statusText);
        }
        return res.json();
    }).then(res => {
        const keys = Object.keys(res)
        const chats = keys.map((k)=>[res[k]['time'], res[k]['sessionId'], res[k]['messageText']]).sort(function(first, second) {
          return second[0] - first[0];
        })
        this.setState({
          messages: chats
        })
    })
  }

  keyPress = e => {
    if(e.key == "Enter" && e.shiftKey == false) {
      e.preventDefault();
      this.myFormRef.submit();
    }
  }

  sendMessage = async (e) => {
    e.preventDefault();

    this.sendData(
        {
          messageText: this.state.formValue,
          //sessionId: this.state.sessionId,
          sessionId: "pat",
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
    const {messages, formValue, sessionId} = this.state;
    const { sendMessage, keyPress } = this;
    return (
            <chat>
              <div class="tab">
                <button class="tablinks">Chatroom</button>
                <button class="tablinks">Catch Up</button>
              </div>
              <main>
                <div>{messages 
                ?
                messages.map(msg => { return(
                <>
                <div className={`message ${this.state.sessionId === msg[1] ? 'sent' : 'received'}`}>
                  <img src={profile} />
                  <p>{msg[2]}</p>
                </div></>)})
                :
                <div>no messages</div>  
                }</div>

              
                {/* <span ref={dummy}></span> */}
              </main>
          
              <form onSubmit={sendMessage} ref={el => this.myFormRef = el}>
                  
                  <textarea value={formValue} onChange={(e) => this.setState({formValue: e.target.value})} onKeyDown={keyPress} placeholder=" Type in anything!" />
            
                  <button type="submit" disabled={!formValue}>🕊️</button>
            
                </form>
          </chat>)
          }
};