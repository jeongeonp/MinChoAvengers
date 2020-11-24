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
        
       return (
        <div className="progressBar">
        {bookmarks.map((value) => <div className="bookmark-tip" key={value} style={{left: value/duration*100+"%"}}>📌 <br/><span className="voice-command">"Replay"</span> </div>)}
        {time_options.map((time_option, index) => 
        {
        return <div className={"bookmark-tip0"} key={index} style={{left: time_option/duration*100+"%"}}/>;})}
        <Progress percent={Math.floor(this.state.played*100)} progress='percent' color='blue' />
        <div className="time-progress">{formatTime(this.state.playedSeconds) + '/' + formatTime(this.state.duration)}</div>
      </div>
       );
    
    }};