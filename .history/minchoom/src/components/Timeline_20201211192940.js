import React from "react";
import '../App.css';
import {Progress} from 'semantic-ui-react';
import slide1 from "../images/astronomy_lecture/IMG_00001.jpeg"
import slide2 from "../images/astronomy_lecture/IMG_00002.jpeg"
import slide3 from "../images/astronomy_lecture/IMG_00003.jpeg"
import slide4 from "../images/astronomy_lecture/IMG_00004.jpeg"
import slide5 from "../images/astronomy_lecture/IMG_00005.jpeg"
import slide6 from "../images/astronomy_lecture/IMG_00006.jpeg"
import slide7 from "../images/astronomy_lecture/IMG_00007.jpeg"
import slide8 from "../images/astronomy_lecture/IMG_00008.jpeg"
import slide9 from "../images/astronomy_lecture/IMG_00009.jpeg"
import slide10 from "../images/astronomy_lecture/IMG_00010.jpeg"
import 'semantic-ui-css/semantic.min.css'
import { Clickable } from 'react-clickable';
import { css } from "@emotion/core";
import ScaleLoader from "react-spinners/ScaleLoader";

const databaseURL = "https://minchoom-cs473.firebaseio.com"

// Helper Functions
function flagToImg(flagTime) {
    const slide_timestamps = [0, 125, 205, 265, 570, 660, 720, 940, 1045, 1155];
    var i = 0;
    while(slide_timestamps[++i] < flagTime);
    //console.log("closest is ", slide_timestamps[--i]);
    switch (i) {
      case 0:
        return slide1;
      case 1:
        return slide2;
      case 2:
        return slide3;
      case 3:
        return slide4;
      case 4:
        return slide5;
      case 5:
        return slide6;
      case 6:
        return slide7;
      case 7:
        return slide8;
      case 8:
        return slide9;
      case 9:
        return slide10;
  
    }
    return i;
  }

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
  height: 5px;
  left: 69vw; 
  margin-top: -3.8vh;
`;

function aggregate_by_type(flags){
    if(flags.length < 2)
        return [];
    var aggregated = [];
    var time = flags[0][1];
    var count = 1;
    var sessionId = flags[0][3];
    for (var i=1; i< flags.length; i++){
         if (flags[i][1] < time + 60 ){
            if(count == 1){
                aggregated.push(flags[i-1]);
            }
            count ++;
         }
         else{
            time = flags[i][1];
            count =  1;
         }
    }
    return aggregated;
}

function aggregate(flags){
    var activity_flags = [];
    var emphasis_flags = [];
    var exclusive_flags = [];
    var notice_flags = [];
    var qna_flags = [];

    var sortedArray = flags.sort(function(a, b) {
        return b[1] - a[1];
    }).reverse();

    for (var i=0; i< sortedArray.length; i++){
        switch (sortedArray[i][0]) {
            case 'Activity':
                activity_flags.push(sortedArray[i]);
                break;
            case 'Emphasis':
                emphasis_flags.push(sortedArray[i]);
                break;
            case 'Exclusive Material':
                exclusive_flags.push(sortedArray[i]);
                break;
            case 'Notice':
                notice_flags.push(sortedArray[i]);
                break;
            case 'Q&A':
                qna_flags.push(sortedArray[i]);
                break;
        }
    }

    var aggregatedFlags = aggregate_by_type(activity_flags).concat(aggregate_by_type(emphasis_flags)).concat(aggregate_by_type(exclusive_flags)).concat(aggregate_by_type(notice_flags)).concat(aggregate_by_type(qna_flags));
    // var removeFlags = [];
    // //console.log(sortedArray);
    // for (var i=1; i<sortedArray.length; i++){

    //     var flagTime = sortedArray[i][1];
    //     for (var j=1; j<i; j++){
    //         var prevFlagTime = sortedArray[j][1];
    //         console.log(sortedArray[i][0] === sortedArray[j][0]);
    //         console.log(flagTime < prevFlagTime + 60);
    //         if (flagTime < prevFlagTime + 60.0 && sortedArray[i][0] === sortedArray[j][0])
    //             removeFlags.push(sortedArray[i]);
    //     }

    // }
    // console.log(removeFlags);
    // aggregatedFlags = sortedArray.filter( el => !removeFlags.includes(el) )
    // if(sortedArray.length)
    //     aggregatedFlags.push(sortedArray[0]);

    return aggregatedFlags;
}

export default class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFlags: this.props.flags,
            questions: [],
            hoverPreview: false,
        };
        this.getFlagData = this.getFlagData.bind(this)
        this.getQuestionData = this.getQuestionData.bind(this)
        this.getUnresolvedQuestions = this.getUnresolvedQuestions.bind(this);

        this.showPreview = this.showPreview.bind(this);
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

    showPreview = (index) => {
        this.setState({hoverPreview: index});
    }



    render() {
        const { flags, videoTime, flagClickHandler, showLoading } = this.props;
        const { currentFlags, hoverPreview } = this.state;
        const { showPreview } = this;
        var allFlags = flags.concat(currentFlags);
        var aggregatedFlags = aggregate(allFlags);
        // console.log(aggregatedFlags);
        return (
            <div className="progressBar-container">
                <div className="progressBar">
                    {
                    aggregatedFlags.map((value, index) => 
                    <div >
                        <div className="preview" hidden={hoverPreview !== index}  style={{left: value[1]/videoTime*65+"%"}}>
                            <img   className={hoverPreview ? 'questionImg' : 'flag-loading-hidden'} src={flagToImg(value[1])}  />
                            <div className={hoverPreview ? null : 'flag-loading-hidden'} style={{color: 'grey'}}> Flagged at {formatTime(value[1])}</div>
                        </div>
                        <Clickable onClick={() => flagClickHandler(value)}>
                            <div className="flag-tip" key={value[1]} style={{left: value[1]/videoTime*65+"%"}} onMouseOver={() => showPreview(index)} onMouseOut = {() => this.setState({hoverPreview: false})}>
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
                    </div>
                    )}
                    <div className={showLoading ? 'flag-loading' : 'flag-loading-hidden'}> 
                    Flags being aggregated
                    </div>
                    {/* <div className={showLoading ? 'flag-loading' : 'flag-loading'}>  */}
                    <ScaleLoader
                        css={override}
                        height={10}
                        radius={1}
                        color={"black"}
                        loading={showLoading}
                    />
                    {/* </div> */}
                    <Progress percent={95} color='light-grey' />
                    <div className="time-progress">{formatTime(videoTime)}</div>
                </div>
            </div>
        );
    }};