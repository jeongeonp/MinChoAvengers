import React from "react";
import '../App.css';
import {Progress} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import { Clickable } from 'react-clickable';
import { css } from "@emotion/core";
import ScaleLoader from "react-spinners/ScaleLoader";

const databaseURL = "https://minchoom-cs473.firebaseio.com"

// Helper Functions
function formatTime(time) {
    time = Math.round(time);
  
    var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ":" + seconds;
}

  const override = css`
  position: absolute;
  font-size: 5px;
  height: 0;
  left: 70%;
  top: -40px;
`;

export default class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFlags: this.props.flags,
            questions: [],
        };
        this.getFlagData = this.getFlagData.bind(this)
        this.getQuestionData = this.getQuestionData.bind(this)
        this.getUnresolvedQuestions = this.getUnresolvedQuestions.bind(this)
    }

    componentDidMount() {
        this.getFlagData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.videoTime !== this.props.videoTime){
            this.getFlagData()
            this.getQuestionData()
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

    getQuestionData = () => {
        fetch( `${databaseURL+'/catchup/questions'}/.json`)
        .then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(res => {
            if (res) {
                const questionKeys = Object.keys(res)
                const questions = questionKeys.map((k)=>[res[k]['answered'], res[k]['answeredSessions'], res[k]['flagId'], res[k]['flagLabel'], res[k]['questionText'], res[k]['sessionId'], res[k]['time'], k]).sort(function(first, second) {
                    return first[6] - second[6];
                })
                
                this.setState({
                    questions: questions,
                })
            }
            
        })
    }

    getUnresolvedQuestions = (flagId) => {
        const unresolvedQuestions = this.state.questions.filter(e => (e[2] === flagId)).filter(q => (q[0] === false)).length
        return unresolvedQuestions;
    }


    render() {
        const { flags, videoTime, flagClickHandler, showLoading } = this.props;
        const { currentFlags } = this.state;
        var aggregatedFlags = flags.concat(currentFlags);
        return (
            <div className="progressBar-container">
                <div className="progressBar">
                    
                    {
                    aggregatedFlags.map((value) => 
                    
                    <Clickable onClick={() => flagClickHandler(value)}>
                        <div className="flag-tip" key={value[1]} style={{left: value[1]/videoTime*65+"%"}}>
                            { value[0] === "Activity" 
                                ?
                                '📝'
                                :
                                value[0] === "Emphasis"
                                ?
                                '⭐'
                                :
                                value[0] === "Exclusive Material"
                                ?
                                '➕'
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
                            { this.getUnresolvedQuestions(value[2]) >= 1
                                ?
                                <div className="unresolvedQuestion">{this.getUnresolvedQuestions(value[2])}</div>
                                :
                                null
                            }
                            
                        </div>
                    </Clickable>
                    )}
                    <div className="flag-loading">
                    Flag being aggregated...
                    </div>
                    <ScaleLoader
                        css={override}
                        color={"black"}
                        loading={true}
                    />
                    <Progress percent={95} color='light-grey' />
                    <div className="time-progress">{formatTime(videoTime)}</div>
                </div>
            </div>
        );
    }};