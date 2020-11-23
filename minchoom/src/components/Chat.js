import React, { useEffect, useRef, useState } from 'react';
import Popup from "reactjs-popup";
import '../App.css';

import firebase from 'firebase/app';
import 'firebase/database';
//import 'firebase/firestore';
//import 'firebase/auth';

//import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/database';


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

const dummys = ["hi", "hi2"]
//const auth = firebase.auth();
//const firestore = firebase.firestore();

//const db = firebase.database(); 

function ChatRoom({ children }) {  
  const databaseURL = "https://minchoom-cs473.firebaseio.com"

  const dummy = useRef();
  //const messagesRef = firebase.collection('messages');
  //const query = messagesRef.orderBy('createdAt').limit(25);

  //const [messages] = useCollectionData(query, { idField: 'id' });

  var messages = [];
  const [formValue, setFormValue] = useState('');
  const [messageValue, setMessageValue] = useState([]);

  // Showing messages
  const text = "hello";
  const sessionId = "12345";

  const messageClass = sessionId === sessionId ? 'sent' : 'received';

  const sendData = (dataDict) => {
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
      getData()
    })
  }

  const getData = () => {
    fetch( `${databaseURL+'/chatroom'}/.json`).then(res => {
        if (res.status !== 200) {
            throw new Error(res.statusText);
        }
        return res.json();
    }).then(res => {
        console.log(res)
        const keys = Object.keys(res)
        console.log(keys)
        const chats = keys.map((k)=>[res[k]['time'], res[k]['sessionId'], res[k]['messageText']]).sort(function(first, second) {
          return second[0] - first[0];
        })
        messages = chats;
        console.log(messages)
        setMessageValue(chats);
    })
  }

  //getData()

  const sendMessage = async (e) => {
    e.preventDefault();

    const sessionId = "julie";

    sendData(
        {
          messageText: formValue,
          sessionId: sessionId,
          time: new Date()
        }
    )
    // await messagesRef.add({
    //   text: formValue,
    //   createdAt: firebase.database.FieldValue.serverTimestamp(),
    //   sessionid
    // })
    setFormValue('');
    //dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return children({ messages, dummy, sendMessage, formValue, setFormValue, messageClass });
}

// function ChatMessage(props) {
//   //const { text, sessionid } = props.message;
//   const text = "hello";
//   const sessionid = "12345";

//   const messageClass = sessionid === sessionid ? 'sent' : 'received';

//   return [ messageClass, text, sessionid ];
// }


export default class Chat extends React.Component {
    render() {
      return (
          <ChatRoom>
            {({ messages, dummy, sendMessage, formValue, setFormValue, messageClass }) => {
              return (<>
                <main>
                  {/* {messages && messages.map(msg => <ChatMessage id={msg.id} message={msg} />)} */}
                  <div>{messages}</div>
                  <div>{messageClass}</div>
                  {messages 
                  ?
                  messages.map(msg => {
                  <> <div>"hello"</div>
                  <div className={`message ${messageClass}`}>
                    <p>{msg[2]}</p>
                    <p>{messageClass}</p>
                  </div>
                  <div><p>hello</p></div>

                  <div>{msg[1]}</div></>})
                  :
                  <div>ddd</div>  
                  }

                
                  <span ref={dummy}></span>
            
                </main>
            
                <form onSubmit={sendMessage}>
            
                  <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="ask your question!" />
            
                  <button type="submit" disabled={!formValue}>🕊️</button>
            
                </form>
            </>)
            }}
          </ChatRoom>
      )
    }
};