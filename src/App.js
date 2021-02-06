import logo from './logo.svg';
import React from 'react';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import {Auth} from 'aws-amplify';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }
  
  async componentDidMount(){
    // https://docs.amplify.aws/lib/restapi/authz/q/platform/js#unauthenticated-requests
    /*const id= await Auth.currentSession().getIdToken().getJwtToken();
    this.setState({ id: id });
    */
  }


  render() {
    return (
      <div className="App">
        {this.state.id}
      </div>
    );
  }
}

/*      <AmplifySignOut />
 */

export default withAuthenticator(App);

/*
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>-->

*/