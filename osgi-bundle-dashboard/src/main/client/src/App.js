import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>FamilyDAM Dashboard-App</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
            <br/>
            <a href="/">Home</a><br/>
            <a href="/apps/app-files/index.html">Files</a><br/>
            <a href="/apps/app-cloudfiles/index.html">Cloud Files</a><br/>
            <a href="/apps/app-photos/index.html">Photos</a><br/>
        </p>
      </div>
    );
  }
}

export default App;
