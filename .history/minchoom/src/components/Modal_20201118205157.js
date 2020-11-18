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
        
        if(open){
            return (
                <Popup>
                </Popup>
            )
        }
        else{
            return (null);
        }
        }};