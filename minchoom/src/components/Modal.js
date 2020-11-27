import React from "react";
import Popup from "reactjs-popup";
import '../App.css';
import 'reactjs-popup/dist/index.css';
import logo from'../images/KatchUp.png';
//import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'
import { Button, Header, Image, Modal } from 'semantic-ui-react'

export default class InstModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          open: true,
          first: true,
          helper: false,
          helpee: false,

        };
        this.setOpen = this.setOpen.bind(this)
        this.changeMode = this.changeMode.bind(this)
      }

      componentDidMount() {
        this.changeMode('first')
      }

      
      handleChange(event) {
        this.setState({input: event.target.value});
      }
    
      handleSubmit(event, close) {
        
        return false;
      }

      setOpen(bool) {
        this.setState({open: bool})
      } 

      changeMode = (inp) => {
        if (inp === 0) {
          this.setState({helper: true, first: false})
        }
        if (inp === 1) {
          this.setState({helpee: true, first: false})
        }
        if (inp === 2) {
          this.setState({helper: false})
          this.props.selectRole(0)
        }
        if (inp === 3) {
          this.setState({helpee: false})
          this.props.selectRole(1)
        }
        if (inp === 4) {
          this.setState({first: true, helper: false})
        }
        if (inp === 5) {
          this.setState({first: true, helpee: false})
        }
          
      }



    render() {
        const { propsOpen, selectRole, closeModal } = this.props;
        const { open, first, helper, helpee } = this.state;
        const { setOpen, changeMode } = this;
        return (
          <>
          
          <Modal
            open={first}
          >
            <Modal.Header>Introduction</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <span style={{lineHeight: '1.8', fontSize: '17px'}}>
                  Welcome! <br/>
                  <img src={logo} style={{width: '65px', height: '28px'}}/> is a system to support <b>late or distract students</b> in online real-time lectures <br/>
                  to help catch up on missed information unavailable in lecture materials. <br/> <br/>
                  Our main features include (1) crowd-generated timeline and (2) context-based QnA between peers. <br/> <br/>
                  Please choose a role below to begin session: <br/>
                </span>
                <Button style={{marginTop: '10px'}} onClick={() => changeMode(0)} content='Helper'/>
                <span style={{margin: '10px'}}></span>
                <Button style={{marginTop: '10px'}} onClick={() => changeMode(1)} color='red' content='Helpee'/>
                <br/>
              </Modal.Description>
            </Modal.Content>
          </Modal>
          
          <Modal
            open={helper}
          >
            <Modal.Header>You are going to be a <u>helper</u> in this session.</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <div style={{lineHeight: '1.8', fontSize: '17px'}}>
                  You have two main tasks as a helper. <br/> <br/>
                  <b>(1) Please participate in generating the flags on the timeline.</b> <br/>
                  There are in total five flags you can select: <br/>
                  <div className="ui left aligned container" style={{width: '85%', paddingLeft: '12%'}}>
                  <b>1. Activity:</b> Attendance, Quiz, In-class Activities <br/>
                  <b>2. Emphasis:</b> Professor's emphasis on which content is important <br/>
                  <b>3. Exclusive Material:</b> Materials not provided (e.g. search on Web, clip video) <br/>
                  <b>4. Notice:</b> Notice or Administrative Notes <br/>
                  <b>5. Q&A:</b> Verbal Q&A <br/>
                  </div>
                  Your participation will be aggregated to generate a lecture timeline.<br/> <br/>

                  <b>(2) Answer the questions asked by the helpees.</b> <br/>
                  Each flag will show the number of questions unanswered via a notification. <br/>
                  Please visit the Catch Up board to answer your peers' questions. <br/> <br/>

                </div>
                <Button
                  onClick={() => changeMode(4)}
                  labelPosition='left'
                  icon='arrow left'
                  content='Back to Introduction'
                />
                <span style={{margin: '10px'}}></span>
                <Button
                  onClick={() => changeMode(2)}
                  positive
                  labelPosition='right'
                  icon='arrow right'
                  content='Begin Session'
                />
                
              </Modal.Description>
            </Modal.Content>
          </Modal>
          
          <Modal
            open={helpee}
          >
            <Modal.Header>You are going to be a <u>helpee</u> in this session.</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <span style={{lineHeight: '1.8', fontSize: '17px'}}>
                  You have two main tasks as a helpee. <br/> <br/>
                  <b>(1) Please look at the flags on the timeline to catch up with the part you missed.</b> <br/>
                  There are in total five types of flags: <br/>
                  <div className="ui left aligned container" style={{width: '85%', paddingLeft: '12%'}}>
                  <b>1. Activity:</b> Attendance, Quiz, In-class Activities <br/>
                  <b>2. Emphasis:</b> Professor's emphasis on which content is important <br/>
                  <b>3. Exclusive Material:</b> Materials not provided (e.g. search on Web, clip video) <br/>
                  <b>4. Notice:</b> Notice or Administrative Notes <br/>
                  <b>5. Q&A:</b> Verbal Q&A <br/>
                  </div>
                  Clicking on the flags will open the Catch Up board <br/>
                  where you can see the corresponding lecture material and the time.<br/> <br/>

                  <b>(2) Ask questions for extra details. </b> <br/>
                  Ask questions through the Catch Up board if you need extra details on the contexts of each flag. <br/>
                  You will be notified when your question is answered. <br/> <br/>

                </span>
                <Button
                  onClick={() => changeMode(5)}
                  labelPosition='left'
                  icon='arrow left'
                  content='Back to Introduction'
                />
                <span style={{margin: '10px'}}></span>
                <Button
                  onClick={() => changeMode(3)}
                  positive
                  labelPosition='right'
                  icon='arrow right'
                  content='Begin Session'
                />
                
              </Modal.Description>
            </Modal.Content>
          </Modal>
          
          {/*
            <Popup open={open} position="top center" >
                  <div className="header"> Choose your role: </div>
                  <div className="content">
                  {" "}
                  </div>
                  <div className="actions">
                  <Button className="button" variant="contained" style={{margin: '10px'}} onClick={() => { console.log("modal closed "); selectRole(0); closeModal();
                      //send to server
                    }}>
                      Helper
                  </Button>
                  <Button className="button" variant="contained" style={{margin: '10px'}} onClick={() => { console.log("modal closed "); selectRole(1); closeModal();
                      //send to server
                    }}>
                      Helpee
                  </Button>
                  </div>
                </div>
              )}
              
            </Popup>
                  */}
                  </>
        )
    }};