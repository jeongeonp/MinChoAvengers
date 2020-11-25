import React from "react";
import Popup from "reactjs-popup";
import '../App.css';

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
            <Popup modal open={open} position="top center" closeOnDocumentClick= {false} >
              <div className="modal">
                    <div className="header"> Choose your role: </div>
                    <div className="content">
                    {" "}
                    Is this where you wanted to go?
                    </div>
                    <div className="actions"></div>

              HI
              </div>
            </Popup>
        )
    }};