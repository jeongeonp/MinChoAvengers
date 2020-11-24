import React from "react";
import Popup from "reactjs-popup";
import '../App.css';

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
           
            <div className="time-progress">{formatTime(videoTime)}</div>
            </div>
        );
    }};