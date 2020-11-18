import React, { Component } from 'react';
import ReactPlayer from 'react-player'
import { Header, Input, Form, Button, Progress, Dimmer, Loader } from 'semantic-ui-react';
import '../App.css';

class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
        playing: false,
        playbackRate: 1.0,
      }
    }

    render() {
        const { } = this.props;
        const {playing, playbackRate} = this.state;
        return (
            <div className="Home">
                <div className="header-bar">
                    <div className="header-title">
                    <Header as="h2">
                        Minchoom 🌿
                    </Header>
                    </div>  
                </div>
                <div className="main-page">
                <div className="split left-wrapper"  tabIndex="1">
                    <div className="main-video">
                    <ReactPlayer ref={this.ref} playing={playing}
                    playbackRate={playbackRate} id="video"  width="100%" height="100%" controls url = {'https://www.youtube.com/watch?v=5UHYX2qI3eE'} onPause={this._onPause}
                    onPlay={this._onPlay}
                    onReady={this._onReady}
                    onProgress={this.handleProgress}
                    onDuration={this.handleDuration}
                    onSeek={this._onSeek}>
                    </ReactPlayer>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}
export default Home;

