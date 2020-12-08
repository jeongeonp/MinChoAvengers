import React, { Component } from 'react';
import ReactPlayer from 'react-player'
import { Button, Image, Message } from 'semantic-ui-react';
import '../App.css';
import katchup from'../images/KatchUp.png';
import Chat from './Chat';
import Catchup from './Catchup';
import Modal from './Modal';
import Timeline from './Timeline';
import Leaderboard from './Leaderboard';
import Container from 'react-bootstrap/Container'
import Fab from '@material-ui/core/Fab';
//import Popover from '@material-ui/core/Popover';
//import Popup from "reactjs-popup";
import Row from 'react-bootstrap/Row'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
 
import Activity from '../images/Activity.png'
import Emphasis from '../images/Emphasis.png'
import Exclusive from '../images/ExclusiveMaterial.png'
import Notice from '../images/Notice.png'
import QnA from '../images/QnA.png'

const databaseURL =  "https://minchoom-cs473.firebaseio.com/";

const adj = ['Alcoholic', 'Silent', 'Big', 'Difficult', 'Courageous', 'Fancy', 'Cruel', 'Materialistic', 'Childlike', 'Ruthless', 
'Flawless', 'Doubtful', 'Jealous', 'Husky', 'Enchanted', 'Idiotic', 'Giant', 'Boring', 'Determined', 'Irritating']
const animal = ['Sheep', 'Chimpanzee', 'Antelope', 'Bear', 'Fox', 'Cat', 'Puma', 'Ape', 'Cow', 'Koala',
'Deer', 'Parrot', 'Donkey', 'Gorilla', 'Alpaca', 'Hamster', 'Frog', 'Elephant', 'Alligator', 'Dingo']

const adj_animal = []

for (var i in adj) {
    for (var j in animal) {
        adj_animal.push(adj[i] + " " + animal[j])
    }
}

//console.log(adj_animal)

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: 0, // 0: helper, 1: helpee
            playing: false,
            playbackRate: 1.0,
            modalOpen: true,
            flags: [],
            tabValue: '1',
            hover: false,
            showPopup: null,
            volume: 0.8,
            // States that will be passed onto Catch Up mode
            tempFlagId: '',
            tempFlagLabel: '',
            tempSessionId: '',
            tempTime: '',

            answeredQuestion: '',
            message: false,

            leaderboard: [],
            leaderboardState: false,

            nameList: [],
        }
        this.sendData = this.sendData.bind(this);
        this.getData = this.getData.bind(this);
        this.addFlag = this.addFlag.bind(this);
        this.addFlagTwice = this.addFlagTwice.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.selectRole = this.selectRole.bind(this);
        this.flagClickHandler = this.flagClickHandler.bind(this);
        this.handleTab = this.handleTab.bind(this);
        this.showFlags = this.showFlags.bind(this);
        this.showAlert = this.showAlert.bind(this);
        this.addParticipationPoint = this.addParticipationPoint.bind(this);
        this.patchParticipationPoint = this.patchParticipationPoint.bind(this);
        this.calcLeaderboard = this.calcLeaderboard.bind(this);
        this.getUsedNames = this.getUsedNames.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
    }
    componentDidMount() {
        this.calcLeaderboard()
        this.getUsedNames()
    }
    
    getFlagData = () => {
        //console.log(this.props.videoTime)
        fetch( `${databaseURL+'/flags'}/.json`).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(res => {
            if (res) {
              const keys = Object.keys(res)
              const chats = keys.map((k)=>[res[k]['time'], res[k]['sessionId'], res[k]['messageText']])
              .filter(e => (e[0]<=this.props.videoTime)).sort(function(first, second) {
                return first[0] - second[0];
              })
              if (this.state.messages.length !== chats.length) {
                this.setState({
                  messages: chats
                })
              }
              
            }
            
        })
      }

    sendData = () => {
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
            //console.log("Dummy data succesfully sent!")
        })
    }

    getData = () => {
        fetch( `${databaseURL+'/dummyData'}/.json`).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(res => {
            //console.log(res)
            this.setState({
                dummyData: res["text"],
            })
        })
    }

    // Send to /sessions/{sessionId}/flags/{flagId}
    addFlag(label) {
        const { flags } = this.state;
        const sessionid = sessionStorage.getItem('sessionID')

        const flagInfo = {
            time: this.state.playedSeconds,
            label: label,
            lectureMaterial: "image",
            sessionId: sessionid
        
        }
        
        //console.log(flagInfo)
        
        fetch(`${databaseURL+'/sessions/'+sessionid+'/flags/'}/.json`, {
            method: 'POST',
            body: JSON.stringify(flagInfo)
        }).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then((res) => {
            //console.log("Flag succesfully sent!")
            this.setState({ showPopup: true});
            setTimeout(() => {
                this.setState({showPopup: false}); 
                flags.push([label, this.state.playedSeconds, res.name, sessionid]);
                flags.sort();
                this.setState({
                    flags: flags,
                });}, 
            3000);
            
            //console.log(flags);

            this.addFlagTwice(flagInfo, res.name)
        })

        this.setState({ hover: false })
    }

    // Send to /flags/{flagId}
    addFlagTwice(flagInfo, flagId) {
        fetch(`${databaseURL+'/flags/'+flagId+'/'}/.json`, {
            method: 'PATCH',
            body: JSON.stringify(flagInfo)
        }).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(() => {
            this.addParticipationPoint(flagInfo['sessionId'], 2)
        })
    }

    closeModal(){
        this.setState({modalOpen: false})
    }

    selectRole(role){
        this.setState({role: role});
        this.closeModal();
        if(role === 1){
            this.player.seekTo(900); // skip 15 minutes
        }
        this.setState({playing: true});

        // Create session name
        var newSessionName = adj_animal[Math.floor(Math.random() * adj_animal.length)]
        while (this.state.nameList.indexOf(newSessionName) > -1) {
            newSessionName = adj_animal[Math.floor(Math.random() * adj_animal.length)]
        }

        if (sessionStorage.getItem('sessionCreated') === null) {
            const startTime = new Date();
            const newSession = {startTime: startTime, role: role, participationPoint: 0, sessionName: newSessionName};
            return fetch( `${databaseURL+'/sessions/'}/.json`, {
                method: 'POST',
                body: JSON.stringify(newSession)
            }).then(res => {
                if (res.status !== 200) {
                    throw new Error(res.statusText);
                }
                return res.json();
            }).then(res => {
                //console.log(res.name);
                //console.log("Session created: ", newSession);
                sessionStorage.setItem('sessionID', res.name);
                sessionStorage.setItem('sessionCreated', true);
                sessionStorage.setItem('sessionName', newSessionName);
            })
        }
        else{
            //console.log("Session exists: ", sessionStorage.getItem('sessionID'));
        }
    }

    getUsedNames() {
        fetch(`${databaseURL+'/sessions'}/.json`)
        .then(res => {
        if (res.status !== 200) {
            throw new Error(res.statusText);
        }
        return res.json();
        }).then(res => {
            if (res) {
                const nameList = Object.keys(res).map(k => res[k]['sessionName']).filter((k) => k !== undefined)
                this.setState({nameList: nameList})
            }
            
        })
    }
    handleVolumeChange = e => {
        this.setState({ volume: parseFloat(e.target.value) })
      }

    flagClickHandler(info){
        //here
        //console.log("Flag info is", info);
        this.handleTab('2')
        this.setState({
            tempFlagId: info[2],
            tempFlagLabel: info[0],
            tempSessionId: info[3],
            tempTime: info[1],
        })

    }

    addParticipationPoint(sessionId, point) {
        //console.log(sessionId, "add this much:", point)
        fetch(`${databaseURL+'/sessions/'+sessionId}/.json`)
        .then(res => {
        if (res.status !== 200) {
            throw new Error(res.statusText);
        }
        return res.json();
        }).then(res => {
            this.patchParticipationPoint(sessionId, res, point)
        })
    }

    patchParticipationPoint(sessionId, sessionInfo, newPoint) {
        sessionInfo['participationPoint'] += newPoint

        fetch(`${databaseURL+'/sessions/'+sessionId}/.json`, {
            method: 'PATCH',
            body: JSON.stringify(sessionInfo)
        }).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(() => {
            this.calcLeaderboard()
        })
    }

    calcLeaderboard() {
        fetch(`${databaseURL+'/sessions'}/.json`)
        .then(res => {
        if (res.status !== 200) {
            throw new Error(res.statusText);
        }
        return res.json();
        }).then(res => {
            if (res) {
                const topThree = Object.keys(res)
                .map(k => [res[k]['sessionName'], res[k]['participationPoint']])
                .filter((k) => k[1] !== undefined)
                .sort((a, b) => b[1] - a[1]).slice(0, 3)

                this.setState({ leaderboard: topThree })
            }
            
        })
    }

    showAlert(text) {
        this.setState({answeredQuestion: text, message: true})
    }

    closeAlert() {
        this.setState({answeredQuestion: '', message: false})
    }


    handleProgress = state => {
        // We only want to update time slider if we are not currently seeking
        this.setState(state);
    }

    ref = player => {
        this.player = player;
    }

    handleTab = (value) => {
        this.setState({ tabValue: value })
    }

    showFlags = () => {
        this.setState({ hover: true })
    }
    
    render() {
        const { volume, playing, playbackRate, modalOpen, tabValue, hover, tempFlagId, tempFlagLabel, tempSessionId, tempTime, answeredQuestion, leaderboardState, leaderboard } = this.state;
        const { addFlag, handleTab, flagClickHandler, showFlags, addParticipationPoint } = this;

        return (
            <div className="Home">
                <div className="header-bar">
                    <div className="header-title">
                            <img className="logo" src={katchup} /> Session Id: <b>{sessionStorage.getItem('sessionID')}</b> / Nickname: <b style={{color: 'red'}}>{sessionStorage.getItem('sessionName')}</b>
                    </div>  
                    <Message positive hidden={true} onTimeout={this.closeAlert} timeout={5000} >
                        <Message.Header>Your question: "{answeredQuestion}" has been answered!</Message.Header>
                    </Message>
                    <div style={{position: "absolute", top: "20px", right: "15px"}}>
                        <Button
                            disabled={this.state.playedSeconds < 1200}
                            onClick={() => this.setState({leaderboardState: true})}
                        >
                            End session
                        </Button>
                    </div>
                </div>
                <Container className="main-page">
                <Row className="split-left"  tabIndex="1">
                    <Row className="main-video">
                        <ReactPlayer ref={this.ref} playing={playing}
                            playbackRate={playbackRate} id="video"  width="100%" height="100%" url = {'https://youtu.be/ECrxWv619p0'} onPause={this._onPause}
                            onPlay={this._onPlay}
                            onReady={this._onReady}
                            onProgress={this.handleProgress}
                            onDuration={this.handleDuration}
                            onSeek={this._onSeek}
                            controls={false}
                            style={{pointerEvents: 'none'}}
                            volume={volume}>
                    
                        </ReactPlayer>
                        
                        <Fab 
                            variant="extended" 
                            style={{top: '-30px', fontWeight: '600', fontSize: '1.4em'}}
                            onMouseOver={showFlags}
                        >
                        🚩Flag
                        </Fab>
                        <div className="buttonGroup" hidden={ hover !== true } onMouseOver={showFlags} onMouseOut={ () => this.setState({ hover: false }) }>
                            <Button.Group>
                                <Button onClick={() => addFlag('Activity')}><Image src={Activity} avatar/> Activity</Button>
                                <Button onClick={() => addFlag('Emphasis')}><Image src={Emphasis} avatar/> Emphasis</Button>
                                <Button onClick={() => addFlag('Exclusive Material')}><Image src={Exclusive} avatar/> Exclusive Material</Button>
                                <Button onClick={() => addFlag('Notice')}><Image src={Notice} avatar/> Notice</Button>
                                <Button onClick={() => addFlag('Q&A')}><Image src={QnA} avatar/> Q&A</Button>
                            </Button.Group>
                        </div>

                    </Row>
                    <br/>
                    <Timeline className="timeline" flagClickHandler={flagClickHandler} flags={this.state.flags} videoTime={this.state.playedSeconds} showLoading={this.state.showPopup}></Timeline>
                </Row>
                <label>
                        Volumee:
                        <input type='range' min={0} max={1} step='any' value={volume} onChange={this.handleVolumeChange} />
                    </label>  
                <Row>
                    <div className="split-right" >                
                        <Tabs variant="fullWidth" tab={tabValue} value={tabValue} onChange={(e, v) => { handleTab(v); }}>
                            <Tab value='1' label="Chatroom">
                            </Tab>
                            <Tab value='2' label="CatchUp">
                            </Tab>
                        </Tabs>
                        <Typography style={{padding: '0px', margin: '0px'}}
                            role="tabpanel"
                            hidden={tabValue !== '1'}
                            className="right">
                            <Chat
                                videoTime={this.state.playedSeconds}
                            />
                        </Typography>
                        <Typography style={{padding: '0px', margin: '0px'}}
                            role="tabpanel"
                            hidden={tabValue !== '2'}
                            className="right">
                            <Catchup
                                videoTime={this.state.playedSeconds}
                                flagId={tempFlagId}
                                flagLabel={tempFlagLabel}
                                sessionId={tempSessionId} // who placed the flag
                                time={tempTime}
                                showAlert={this.showAlert}
                                addParticipationPoint={addParticipationPoint}
                            />
                        </Typography>
                    </div>
                </Row>
                </Container>
                {/* <Popup open = {this.state.showPopup} position="top center" >
                    <div className="popup-modal">
                    Flags being aggregated...
                    </div>
                </Popup> */}
                <Modal open={modalOpen} closeModal={this.closeModal} selectRole={this.selectRole}></Modal>
                <Leaderboard open={leaderboardState} topThree={leaderboard}></Leaderboard>
            </div>
        )
    }
}
export default Home;
