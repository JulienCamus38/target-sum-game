import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Game from './components/Game/Game';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Target sum game</h1>
        </header>
        <p className="App-intro"></p>
        <Game
            challengeSize={6}
            challengeRange={[2, 9]}
            initialSeconds={15}
            answerSize={4}
          />
      </div>
    );
  }
}

export default App;
