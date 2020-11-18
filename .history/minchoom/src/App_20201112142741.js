import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/Home'



class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home}></Route>
        </div>
      </Router>
    );
  }
}

export default App;
