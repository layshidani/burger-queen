import React from 'react';
import './App.css';
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Saloon from './pages/Saloon'
import Kitchen from './pages/Kitchen'
import Ready from './pages/Ready-orders'
import {BrowserRouter as Router, Route} from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Router>
      <div className="App">
        <header className="App-header">
          <Route exact path="/" component={Home}/>
          <Route exact path="/SignUp" component={SignUp}/>
          <Route exact path="/Saloon" component={Saloon}/>
          <Route exact path="/Kitchen" component={Kitchen}/>
          <Route exact path="/Ready" component={Ready}/>
        </header>
      </div>
    </Router>
    );
  }
}

export default App;
