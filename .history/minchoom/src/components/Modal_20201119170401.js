import React from "react";
import Popup from "reactjs-popup";
import '../App.css';
import 'reactjs-popup/dist/index.css';
import Button, IconButton from '@material-ui/core/';

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
                  <IconButton className="close"  onClick={close}>
                    &times;
                  </IconButton>
                  <div className="header"> Choose your role: </div>
                  <div className="content">
                  {" "}
                  </div>
                  <div className="actions">
                  <Button className="button" variant="contained" onClick={() => { console.log("modal closed "); closeModal();
                      //send to server
                    }}>
                      Helper
                  </Button>
                  <Button className="button" variant="contained" onClick={() => { console.log("modal closed "); closeModal();
                      //send to server
                    }}>
                      Helpee
                  </Button>
                  </div>
                </div>
              )}
              
            </Popup>
        )
    }};