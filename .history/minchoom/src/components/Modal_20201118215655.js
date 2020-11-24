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
                  <button className="close" onClick={close}></button>
                  <div className="header"> Choose your role: </div>
                  <div className="content">
                  {" "}
                  Is this where you wanted to go?
                  </div>
                  <div className="actions"></div>
                </div>
              )}
              
            </Popup>
        )
    }};