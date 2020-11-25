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
        const { flags, videoTime, flagClickHandler  } = this.props;
        return (
            <div className="progressBar-conntainer">
                <div className="progressBar">
                    {
                    flags.map((value) => 
                    
                    <Clickable onClick={() => flagClickHandler(value)}>
                        <div className="flag-tip" key={value[1]} style={{left: value[1]/videoTime*65+"%"}}>
                            { value[0] === "Activity" 
                                ?
                                '🚩'
                                :
                                value[0] === "Emphasis"
                                ?
                                'EM'
                                :
                                value[0] === "Exclusive"
                                ?
                                'EX'
                                :
                                value[0] === "Notice"
                                ?
                                'No'
                                :
                                value[0] === "Q&A"
                                ?
                                'QA'
                                :
                                null
                            }
                        </div>
                    </Clickable>
                    )}
                    <Progress percent={95} color='light-grey' />
                    <div className="time-progress">{formatTime(videoTime)}</div>
                </div>
            </div>
        );
    }};