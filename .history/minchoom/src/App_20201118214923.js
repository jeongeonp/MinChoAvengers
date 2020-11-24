import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/Home'
import Modal from './components/Modal';



class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    
    return (
      // <Router>
      //     <Route exact path="/" component={Home}></Route>
      // </Router>
      <Modal open={modalOpen}></Modal>
    );
  }
}

export default App;
