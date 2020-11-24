import React from "react";
import Popup from "reactjs-popup";
import '../App.css';
import {Progress} from 'semantic-ui-react';

// Helper Functions
function formatTime(time) {
    time = Math.round(time);
  
    var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ":" + seconds;
  }

export default class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
          };
      }

      


    render() {
        const { flags, videoTime  } = this.props;
        return (
            <div className="progressBar">
            {flags.map((value) => <div className="bookmark-tip" key={value} style={{left: value/videoTime*100+"%"}}>📌 <br/><span className="voice-command">"Replay"</span> </div>)}
            
            <Progress active progress='value' value={35} />
            <div className="time-progress">{formatTime(videoTime)}</div>
            </div>
        );
    }};