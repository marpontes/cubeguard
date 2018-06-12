import React, { Component } from 'react';
import logo from './cubeguardw.svg';
import './App.css';
import SchemasList from '../SchemasList/SchemasList';

import { connect } from 'react-redux';
import { getConfig }  from '../../actions/config';

class App extends Component {

  componentDidMount(){
    this.props.getConfig();
  }

  render() {
    if ( this.props && this.props.config && this.props.config !== null ){
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Cubeguard</h1>
          </header>
          <SchemasList />
        </div>
      );
    }else{
      return <div>Loading...</div>
    }
  }
}


function mapStateToProps({config}) {
  return { config };
}

export default connect(mapStateToProps, { getConfig })(App);
