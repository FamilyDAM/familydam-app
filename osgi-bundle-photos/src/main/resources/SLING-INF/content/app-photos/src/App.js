import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>FamilyDAM Photos-App</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
            <br/>
            <a href="/">Home</a><br/>
            <a href="/app-files/index.html">Files</a><br/>
            <a href="/app-usermanager/index.html">User Manager</a><br/>
            <a href="/app-photos/index.html">Photos</a><br/>
        </p>
      </div>
    );
  }
}

export default App;
