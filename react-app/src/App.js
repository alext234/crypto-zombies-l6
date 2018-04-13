import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';

var cryptoZombiesABI = require('./cryptozombies_abi.js').abi;

class App extends Component {
  web3js;
  
  state = {
      web3js: undefined, // web3 API
      cryptoZombies: undefined, // the contract
  }

  checkMetamaskWeb3= () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      var cryptoZombiesAddress="0xc4e157D452FBaA20767cFD051099a4ccb7a9A911"; // on Kovan network
      var web3js = new Web3(window.web3.currentProvider)
      var cryptoZombies = new web3js.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);
      this.setState ({
        web3js: web3js,
        cryptoZombies: cryptoZombies,
      })
    } else {
      // Handle the case where the user doesn't have web3. Probably 
      // show them a message telling them to install Metamask in 
      // order to use our app.
    }
    
  }
  
  componentDidMount() {
    window.addEventListener('load', this.checkMetamaskWeb3);
  }
  componentWillUnmount() {
    window.removeEventListener('load', this.checkMetamaskWeb3);
  }
  
  startApp() {
    // TODO
  }
  
  handleStartButton = () => {
    this.startApp()
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <button onClick={()=>this.handleStartButton()} >StartApp</button>
        </p>
      </div>
    );
  }
}

export default App;
