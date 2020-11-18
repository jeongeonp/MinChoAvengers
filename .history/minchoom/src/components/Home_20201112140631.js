import React, { Component } from 'react';
import ReactPlayer from 'react-player'
class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
        
      }
    }

    render() {
        const { } = this.props;
        const {} = this.state;
        return (
            <div className="Home">
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
        )
    }
}
export default Home;

