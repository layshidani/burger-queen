import React from 'react';
import './App.css';
import home from './pages/home'
import signUp from './pages/signUp'
import saloon from './pages/saloon'
import kitchen from './pages/kitchen'
import ready from './pages/ready-orders'
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
          <Route exact path="/" component={home}/>
          <Route exact path="/signUp" component={signUp}/>
          <Route exact path="/saloon" component={saloon}/>
          <Route exact path="/kitchen" component={kitchen}/>
          <Route exact path="/ready" component={ready}/>
        </header>
      </div>
    </Router>
    );
  }
}

export default App;
