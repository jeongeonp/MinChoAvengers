import React, { Component } from 'react';
import ReactPlayer from 'react-player'
import { Header, Input, Form, Button, Progress, Dimmer, Loader, Image } from 'semantic-ui-react';
import '../App.css';
import katchup from'../images/KatchUp.png';
import Chat from './Chat';
import Catchup from './Catchup';
import Modal from './Modal';
import Timeline from './Timeline';
import Container from 'react-bootstrap/Container'
import Fab from '@material-ui/core/Fab';
import Popover from '@material-ui/core/Popover';

import Row from 'react-bootstrap/Row'
import PieMenu, { Slice } from 'react-pie-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 
import Activity from '../images/Activity.png'
import Emphasis from '../images/Emphasis.png'
import Exclusive from '../images/ExclusiveMaterial.png'
import Notice from '../images/Notice.png'
import QnA from '../images/QnA.png'

const databaseURL =  "https://minchoom-cs473.firebaseio.com/";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: 0, // 0: helper, 1: helpee
            playing: false,
            playbackRate: 1.0,
            modalOpen: true,
            dummyData: "no data yet",
            flags: [],
            anchorEl: null,
        }
        this.sendData = this.sendData.bind(this);
        this.getData = this.getData.bind(this);
        this.addFlag = this.addFlag.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.selectRole = this.selectRole.bind(this);
        this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
        this.handlePopoverClose = this.handlePopoverClose.bind(this);
    }
    componentDidMount() {
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

    addFlag(label) {
        const {flags} = this.state;
        flags.push(this.state.playedSeconds);
        flags.sort();
        this.setState({
            flags: flags,
        });
        console.log(flags, this.state.playedSeconds);
        const sessionid = sessionStorage.getItem('sessionID')
        const flagInfo = {
            time: this.state.playedSeconds,
            label: label,
            lectureMaterial: "image",
            sessionId: sessionid
        }
        
        console.log(flagInfo)
        
        fetch( `${databaseURL+'/sessions/'+sessionid+'/flags/'}/.json`, {
            method: 'POST',
            body: JSON.stringify(flagInfo)
        }).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(() => {
            console.log("Flag succesfully sent!")
        })
        
        

    }

    closeModal(){
        this.setState({modalOpen: false})
    }

    selectRole(role){
        this.setState({role: role});
        this.closeModal();
        if(role==1){
            this.player.seekTo(900); // skip 15 minutes
        }
        this.setState({playing: true});

        if (sessionStorage.getItem('sessionCreated') === null) {
            const startTime = new Date();
            const newSession = {startTime: startTime, role: role};
            return fetch( `${databaseURL+'/sessions/'}/.json`, {
                method: 'POST',
                body: JSON.stringify(newSession)
            }).then(res => {
                if (res.status !== 200) {
                    throw new Error(res.statusText);
                }
                return res.json();
            }).then(res => {
                console.log(res.name);
                console.log("Session created: ", newSession);
                sessionStorage.setItem('sessionID', res.name);
                sessionStorage.setItem('sessionCreated', true);
            })
        }
        else{
            console.log("Session exists: ", sessionStorage.getItem('sessionID'));
        }
    }

    handlePopoverOpen = (event) => {
        this.setState({ anchorEl: event.currentTarget })
        console.log(this.state.anchorEl)
    };

    handlePopoverClose = () => {
        this.setState({ anchorEl: null })
        console.log("**", this.state.anchorEl)
    };

    
    handleProgress = state => {
        // We only want to update time slider if we are not currently seeking
        this.setState(state);
    }

    ref = player => {
        this.player = player;
    }

    render() {
        const { } = this.props;
        const { playing, playbackRate, dummyData, modalOpen, buttonsOpen, anchorEl } = this.state;
        const { sendData, getData, addFlag, handlePopoverOpen, handlePopoverClose } = this;
        return (
            <div className="Home">
                <div className="header-bar">
                    <div className="header-title">
                        
                        <Header as="h3">
                            <img src={katchup} /> Session Number: {sessionStorage.getItem('sessionID')}
                        </Header>
                   
                    </div>  
                </div>
                <Container className="main-page">
                <Row className="split-left"  tabIndex="1">
                    <Row className="main-video">
                        <ReactPlayer ref={this.ref} playing={playing}
                            playbackRate={playbackRate} id="video"  width="100%" height="100%" controls url = {'https://www.youtube.com/watch?v=jGwO_UgTS7I'} onPause={this._onPause}
                            onPlay={this._onPlay}
                            onReady={this._onReady}
                            onProgress={this.handleProgress}
                            onDuration={this.handleDuration}
                            onSeek={this._onSeek}>
                        </ReactPlayer>
                        
                        <Fab 
                            variant="extended" 
                            style={{top: '-45px', fontWeight: '600', fontSize: '1.4em'}} 
                            onClick={addFlag}
                            onMouseEnter={handlePopoverOpen}
                        >
                        🚩Flag
                            
                        </Fab>
                        
                        <Button.Group 
                            vertical
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handlePopoverClose}
                            style={{top: '-55px'}}
                        >
                            <Button><Image src={Activity} avatar/> Activity</Button>
                            <Button><Image src={Emphasis} avatar/> Emphasis</Button>
                            <Button><Image src={Exclusive} avatar/> Exclusive Material</Button>
                            <Button><Image src={Notice} avatar/> Notice</Button>
                            <Button><Image src={QnA} avatar/> Q&A</Button>
                        </Button.Group>
                        
                    </Row>
                    <br/>
                    <Timeline flags={this.state.flags} videoTime={this.state.playedSeconds}></Timeline>
                </Row>
                <Row>
                    <div className="split-right" >
                    <Chat>

                    </Chat>

                    {/*
                    <button type="button" onClick={sendData}>Send dummy data to database</button> <br/> <br/>
                    <button type="button" onClick={getData}>Get dummy data from database</button> <br/> <br/>
                    { dummyData 
                        ?
                        <span style={{border: "2px solid blue", padding: "3px", margin: "3px"}}>{dummyData}</span>
                        :
                        <span> no data yet</span>
                    }*/}
                    </div>
                </Row>
                </Container>
                <Modal open={!modalOpen} closeModal={this.closeModal} selectRole={this.selectRole}></Modal>
            </div>
        )
    }
}
export default Home;

