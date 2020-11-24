import React, { Component } from 'react';
import ReactPlayer from 'react-player'
import { Header, Input, Form, Button, Progress, Dimmer, Loader } from 'semantic-ui-react';
import '../App.css';
import logo from'../minchoom-logo.png';
import Chat from './Chat';
import Modal from './Modal';

const databaseURL = "https://minchoom-cs473.firebaseio.com/";

class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
        playing: false,
        playbackRate: 1.0,

        dummyData: "no data yet",
      }
      this.sendData = this.sendData.bind(this);
      this.getData = this.getData.bind(this);
    }

    sendData = () => {
        const sampleString = "Sent at " + new Date() + "- last dummy data from firebase."
        const sampleDict = {text: "Sent at " + new Date() + "- last dummy data from firebase."}
        return fetch( `${databaseURL+'/dummyData'}/.json`, {
            method: 'PATCH',
            body: JSON.stringify(sampleDict)
        }).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(() => {
            console.log("Dummy data succesfully sent!")
        })
    }

    getData = () => {
        fetch( `${databaseURL+'/dummyData'}/.json`).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(res => {
            const keys = Object.keys(res)
            console.log(res)
            this.setState({
                dummyData: res["text"],
            })
        })
    }

    render() {
        const { } = this.props;
        const {playing, playbackRate, dummyData} = this.state;
        const { sendData, getData } = this;
        return (
            <div className="Home">
                <div className="header-bar">
                    <div className="header-title">
                        <img src={logo} alt="fireSpot"/>
                    </div>  
                </div>
                <div className="main-page">
                <div className="split-left"  tabIndex="1">
                    <div className="main-video">
                    <ReactPlayer ref={this.ref} playing={playing}
                    playbackRate={playbackRate} id="video"  width="100%" height="100%" controls url = {'https://www.youtube.com/watch?v=rj_YjNakQ5k'} onPause={this._onPause}
                    onPlay={this._onPlay}
                    onReady={this._onReady}
                    onProgress={this.handleProgress}
                    onDuration={this.handleDuration}
                    onSeek={this._onSeek}>
                    </ReactPlayer>
                    </div>
                </div>
                <div className="split-right" >
                    <Chat>

                    </Chat>
                    <button type="button" onClick={sendData}>Send dummy data to database</button> <br/> <br/>
                    <button type="button" onClick={getData}>Get dummy data from database</button> <br/> <br/>
                    { dummyData 
                        ?
                        <span style={{border: "2px solid blue", padding: "3px", margin: "3px"}}>{dummyData}</span>
                        :
                        <span> no data yet</span>
                    }
                </div>
                </div>
                <Modal open={true}></Modal>
            </div>
        )
    }
}
export default Home;

