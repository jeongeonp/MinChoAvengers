import React from "react";
import '../App.css';
import {Progress} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import { Clickable } from 'react-clickable';

const databaseURL = "https://minchoom-cs473.firebaseio.com"

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
            currentFlags: this.props.flags,
        };
        this.getFlagData = this.getFlagData.bind(this)
    }

    componentDidMount() {
        this.getFlagData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.videoTime !== this.props.videoTime){
            this.getFlagData()
        }
      }
    
    getFlagData = () => {
        //console.log(this.props.flags)
        fetch( `${databaseURL+'/flags'}/.json`).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(res => {
            if (res) {
                const keys = Object.keys(res)
                
                const filteredFlags = keys.map((k)=>[res[k]['label'], res[k]['time'], k, res[k]['sessionId']])
                .filter(e => (e[1]<=this.props.videoTime))

                this.setState({
                    currentFlags: filteredFlags
                })
                
            }
            
        })
      }


    render() {
        const { flags, videoTime, flagClickHandler } = this.props;
        const { currentFlags } = this.state;
        return (
            <div className="progressBar-conntainer">
                <div className="progressBar">
                    {
                    currentFlags.map((value) => 
                    
                    <Clickable onClick={() => flagClickHandler(value)}>
                        <div className="flag-tip" key={value[1]} style={{left: value[1]/videoTime*65+"%"}}>
                            { value[0] === "Activity" 
                                ?
                                '💻'
                                :
                                value[0] === "Emphasis"
                                ?
                                '⭐'
                                :
                                value[0] === "Exclusive"
                                ?
                                '🤫'
                                :
                                value[0] === "Notice"
                                ?
                                '📌'
                                :
                                value[0] === "Q&A"
                                ?
                                '🙋'
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