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
        
        if(open){
            return (
                <Popup open={open} position="top center" closeOnDocumentClick= {false} modal>
                  <div className="modal">
                        <div className="header"> Choose your role: </div>
                        <div className="content">
                        {" "}
                        Is this where you wanted to go?
                        </div>
                        <div className="actions"></div></div>
                </Popup>
            )
        }
        else{
            return (null);
        }
    }};