import React, { Component } from 'react';
import './App.css'
import './flags.css'
import { status, json, makeGraph } from './helpers.js'

class App extends Component {
  componentDidMount() {
    // get json data and make graph
    fetch(
      "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json"
    )
      .then(status)
      .then(json)
      .then(data => {
        makeGraph(data);
      });
  }
  render() {
    return (
      <div className="App">
        <h1>National Contiguity Force Directed Graph</h1>
        <div className="svg-container">
          <div className="flag-container"></div>
        </div>
      </div>
    );
  }
}

export default App;
