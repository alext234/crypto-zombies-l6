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
      userAccount: undefined,
      displayedZombies:[],
  }

  checkMetamaskWeb3= () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      var cryptoZombiesAddress="0xc4e157D452FBaA20767cFD051099a4ccb7a9A911"; // on Kovan network
      var web3js = new Web3(window.web3.currentProvider)
      var cryptoZombies = new web3js.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);
      console.log("detected webjs from metamask")
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
  
  getTransferEventsToUserAccount() {
    // TODO: and call this from checkAndUpdateUserAccount?
  }
  
  getZombiesByOwner(owner) {
    return this.state.cryptoZombies.methods.getZombiesByOwner(owner).call()
  }
  
  
  getZombieDetails(id) {
    return this.state.cryptoZombies.methods.zombies(id).call()
  }
  
  displayZombies(ids) {
    this.setState({displayedZombies:[]})
    
    for (let id of ids) {
      this.getZombieDetails(id).then(function(zombie) {
        this.setState( prevState => ({
          displayedZombies: [...prevState.displayedZombies, zombie]
        }))
      }.bind(this))
    }
  }
  
  checkAndUpdateUserAccount() {
    this.state.web3js.eth.getAccounts((error, accounts)=>{
      if (accounts.length === 0) {
        console.log("no account found")
      } else {
        const ethFromAddress = accounts[0]
        if (ethFromAddress !== this.state.userAccount) {
          console.log("account is: "+ ethFromAddress)
          this.setState({userAccount: ethFromAddress})
          
          this.getZombiesByOwner(this.state.userAccount).then(this.displayZombies.bind(this))
        }
      }
    })
  }
  
  startApp() {
    setInterval(this.checkAndUpdateUserAccount.bind(this), 1000);
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
        <table border="1">
          <thead>
            <tr >
              <td>Name</td>
              <td>DNA</td>
              <td>Level</td>
              <td>Win Count</td>
              <td>Loss Count</td>
            </tr>
          </thead>
          <tbody>
          {
            this.state.displayedZombies.map(( zombie, index ) => {
              return (
                <tr key={index}>
                  <td>{zombie.name}</td>
                  <td>{zombie.dna}</td>
                  <td>{zombie.level}</td>
                  <td>{zombie.winCount}</td>
                  <td>{zombie.lossCount}</td>
                </tr>
              );
            })          
          }
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
