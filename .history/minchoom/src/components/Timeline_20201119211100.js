import React from "react";
import '../App.css';
import {Progress} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import { Clickable } from 'react-clickable';


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
            {flags.map((value) => <Clickable><div className="flag-tip" key={value} style={{left: value/videoTime*100+"%"}}>🚩 </div></Clickable>)}
            <Progress   percent={95} color='light-grey' />
            <div className="time-progress">{formatTime(videoTime)}</div>
            </div>
        );
    }};