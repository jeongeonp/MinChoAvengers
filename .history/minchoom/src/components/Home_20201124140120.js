import React, { Component } from 'react';
import ReactPlayer from 'react-player'
import { Header, Input, Form, Button, Progress, Dimmer, Loader } from 'semantic-ui-react';
import '../App.css';
import logo from'../images/KatchUp.png';
import Chat from './Chat';
import Modal from './Modal';
import Timeline from './Timeline';
import Container from 'react-bootstrap/Container'
import Fab from '@material-ui/core/Fab';
import Row from 'react-bootstrap/Row'
import PieMenu, { Slice } from 'react-pie-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 
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
        }
        this.sendData = this.sendData.bind(this);
        this.getData = this.getData.bind(this);
        this.addFlag = this.addFlag.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.selectRole = this.selectRole.bind(this);
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

    addFlag() {
        const { flags} = this.state;
        flags.push(this.state.playedSeconds);
        flags.sort();
        this.setState({
        flags: flags,
        });
        console.log(flags, this.state.playedSeconds);
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

    closeModal(){
        this.setState({modalOpen: false})
    }

    selectRole(role){
        this.setState({role: role});
        this.closeModal;
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

    
    handleProgress = state => {
        // We only want to update time slider if we are not currently seeking
        this.setState(state);
    }

    ref = player => {
        this.player = player;
    }

    render() {
        const { } = this.props;
        const {playing, playbackRate, dummyData, modalOpen} = this.state;
        const { sendData, getData, addFlag } = this;
        return (
            <div className="Home">
                <div className="header-bar">
                    <div className="header-title">
                        {/* <img src={logo} alt="fireSpot"/> */}
                    
                    <Header as="h1">
                        Minchoom 🌿
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
                    {/* <PieMenu 
                    radius='125px' 
                    centerRadius='30px'
                    centerX={3000}
                    centerY={1000}
                    className="pie-menu"
                    >
                    <Slice>Exclusive</Slice>
                    <Slice>Notice</Slice>
                    <Slice>QnA</Slice>
                    <Slice onSelect={() => window.open('https://www.facebook.com', '_blank')} >
                        <FontAwesomeIcon icon="info-circle" size="2x" />
                    </Slice>

                    <Slice ></Slice>
                    <Slice onSelect={() => window.open('https://www.facebook.com', '_blank')}>
                        <FontAwesomeIcon icon="facebook-f" size="2x" />
                    </Slice>


                    <Slice onSelect={() => window.open('https://www.twitter.com', '_blank')}>
                        <FontAwesomeIcon icon="twitter" size="2x" />
                    </Slice>

                    <Slice onSelect={() => window.open('https://www.linkedin.com', '_blank')}>
                        <FontAwesomeIcon icon="linkedin-in" size="2x" />
                    </Slice>
                    <Slice>Activity</Slice>
                    <Slice>Emphasis</Slice>
                    </PieMenu> */}
                    <Fab variant="extended" style={{top: '-45px', fontWeight: '600', fontSize: '1.4em'}} onClick={addFlag}>
                    🚩Flag
                    </Fab>
                    </Row>
                    <Timeline flags={this.state.flags} videoTime={this.state.playedSeconds}></Timeline>
                </Row>
                <Row className="split-right" >
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
                </Row>
                </Container>
                <Modal open={modalOpen} closeModal={this.closeModal} selectRole={this.selectRole}></Modal>
            </div>
        )
    }
}
export default Home;

