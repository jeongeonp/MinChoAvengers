import React from "react";
import Popup from "reactjs-popup";
import '../App.css';
import 'reactjs-popup/dist/index.css';
import logo from'../images/KatchUp.png';
import flagButton from '../images/FlagButton.png'
import mainpage from '../images/katchup-mainpage.jpeg'
//import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'
import { Button, Header, Image, Modal, ModalActions } from 'semantic-ui-react'

export default class InstModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          open: true,
          first: true,
          feature: false,
          helperEnd: false,
          helpeeEnd: false,

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
        // First page to second page (feature)
        if (inp === 0) {
          this.setState({first: false, feature: true})
        }

        // Second page (feature) to first page
        if (inp === 2) {
          this.setState({feature: false, first: true})
        }

        // Second page (feature) to last page (end)
        if (inp === 4) {
          this.setState({feature: false, helperEnd: true})
        }
        if (inp === 5) {
          this.setState({feature: false, helpeeEnd: true})
        }

        // Last page (end) to second page (feature)
        if (inp === 6) {
          this.setState({feature: true, helperEnd: false})
        }
        if (inp === 7) {
          this.setState({feature: true, helpeeEnd: false})
        }

        // Close last page
        if (inp === 8) {
          this.setState({helperEnd: false})
          this.props.selectRole(0)
        }
        if (inp === 9) {
          this.setState({helpeeEnd: false})
          this.props.selectRole(1)
        }
          
      }



    render() {
        const { propsOpen, selectRole, closeModal } = this.props;
        const { open, first, feature, helperEnd, helpeeEnd } = this.state;
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
                  <img src={logo} style={{width: '65px', height: '28px'}}/> is a system to support <b>late or distracted students</b> in online real-time lectures <br/>
                  to help catch up on missed information unavailable in lecture materials. <br/> <br/>
                  Our main features include <b>(1) crowd-generated timeline</b> and <b>(2) context-based Q&A between peers.</b> <br/>
                  Details will be explained on the next page. <br/>
                </span>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button
                onClick={() => changeMode(0)}
                labelPosition='right'
                icon='arrow right'
                content='Begin Feature Description'
              />
            </Modal.Actions>
          </Modal>

          <Modal
            open={feature}
          >
            <Modal.Header>Main Features</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <span style={{lineHeight: '1.8', fontSize: '17px'}}>
                  This is the overall system. <br/>
                  <img className="mainimg" src={mainpage}/> <br/> 
                  <b>#1</b> is the <b><u>crowd-generated timeline</u></b>. <br/>
                  This is used for the helpees to identify the missed parts, not in the lecture materials. <br/>
                  The timeline is generated by the helpers, aggregated with their button clicks through  
                  <img src={flagButton} style={{width: '50px', height: '25px', margin: '0px 0px 0px 5px'}}/>. <br/> <br/>

                  <b>#2</b> is the <b><u>Catchup board</u></b>, a context-based Q&A board. <br/>
                  Here, the helpees can ask questions to clarify the contents of the flags. <br/>
                  The helpers can either answer the questions asked, or upvote good answers. <br/> <br/>

                  Please <b><u>choose a role</u></b> below to begin session: <br/>
                </span>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button 
                floated='left'
                onClick={() => changeMode(2)}
                labelPosition='left'
                icon='arrow left'
                content='Back to Introduction'
              />
              <Button onClick={() => changeMode(4)} color='google plus' content='1. Helper'/>
              <Button onClick={() => changeMode(5)} color='google plus' content='2. Helpee'/>
            </Modal.Actions>
          </Modal>
          
          <Modal
            open={helperEnd}
          >
            <Modal.Header>You are going to be a <u>helper</u> in this session.</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <div style={{lineHeight: '1.8', fontSize: '17px'}}>
                  You have two main tasks as a <b><u>helper</u></b>. <br/> <br/>
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
                  Please visit the Catchup board to answer your peers' questions. <br/>
                </div>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button
                floated='left'
                onClick={() => changeMode(6)}
                labelPosition='left'
                icon='arrow left'
                content='Back to Feature'
              />
              <Button
                onClick={() => changeMode(8)}
                positive
                labelPosition='right'
                icon='arrow right'
                content='Begin Session'
              />
            </Modal.Actions>
          </Modal>
          
          <Modal
            open={helpeeEnd}
          >
            <Modal.Header>You are going to be a <u>helpee</u> in this session.</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <span style={{lineHeight: '1.8', fontSize: '17px'}}>
                  You have two main tasks as a <b><u>helpee</u></b>. <br/> <br/>
                  <b>(1) Please look at the flags on the timeline to catch up with the part you missed.</b> <br/>
                  There are in total five types of flags: <br/>
                  <div className="ui left aligned container" style={{width: '85%', paddingLeft: '12%'}}>
                  <b>1. Activity:</b> Attendance, Quiz, In-class Activities <br/>
                  <b>2. Emphasis:</b> Professor's emphasis on which content is important <br/>
                  <b>3. Exclusive Material:</b> Materials not provided (e.g. search on Web, clip video) <br/>
                  <b>4. Notice:</b> Notice or Administrative Notes <br/>
                  <b>5. Q&A:</b> Verbal Q&A <br/>
                  </div>
                  Clicking on the flags will open the Catchup board <br/>
                  where you can see the corresponding lecture material and the time.<br/> <br/>

                  <b>(2) Ask questions for extra details. </b> <br/>
                  Ask questions through the Catch Up board if you need extra details on the contexts of each flag. <br/>
                  You will be notified when your question is answered. <br/>
                </span>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button
                floated='left'
                onClick={() => changeMode(7)}
                labelPosition='left'
                icon='arrow left'
                content='Back to Feature'
              />
              <Button
                onClick={() => changeMode(9)}
                positive
                labelPosition='right'
                icon='arrow right'
                content='Begin Session'
              />
            </Modal.Actions>
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