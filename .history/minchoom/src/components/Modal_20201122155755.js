import React from "react";
import Popup from "reactjs-popup";
import '../App.css';
import 'reactjs-popup/dist/index.css';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'

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
        const { open, selectRole, } = this.props;
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
                  <Button className="button" variant="contained" onClick={() => { console.log("modal closed "); selectRole(0);
                      //send to server
                    }}>
                      Helper
                  </Button>
                  <Button className="button" variant="contained" onClick={() => { console.log("modal closed "); selectRole(1);
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