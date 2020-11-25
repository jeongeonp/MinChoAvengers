import React from "react";
import Popup from "reactjs-popup";
import '../App.css';
import 'reactjs-popup/dist/index.css';

export default class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
          };
      }

      
      handleChange(event) {
        this.setState({input: event.target.value});
      }
    
      handleSubmit(event, close) {
        
        return false;
      }



    render() {
        const { open, closeModal, } = this.props;
        return (
            <Popup  open={open} position="top center" >
              {close => (
                <div className="modal">
                  <button className="close" onClick={close}>
                    &times;
                  </button>
                  <div className="header"> Choose your role: </div>
                  <div className="content">
                  {" "}
                  </div>
                  <div className="actions">
                  <button className="button" onClick={() => { console.log("modal closed "); closeModal();
                      //send to server
                    }}>
                      Helper
                  </button>
                  <button className="button" onClick={() => { console.log("modal closed "); closeModal();
                      //send to server
                    }}>
                      Helpee
                  </button>
                  </div>
                </div>
              )}
              
            </Popup>
        )
    }};