import logo from './logo.svg';
import React from 'react';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import {Auth} from 'aws-amplify';
import CalendarioPrenotazioni from './routes/calendarioPrenotazioni';
import PrenotazioniDelGiorno from './routes/prenotazioniDelGiorno';
import GestisciPrenotazioni from './routes/gestisciPrenotazioni';
import {
  Switch,
  Route,
  Link
} from "react-router-dom";
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

function Home() {
  return <h2>Home</h2>;
}

// https://medium.com/@ryoldash/customize-webpack-config-of-react-app-created-with-create-react-app-7a78c7849edc

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }
  
  componentDidMount(){
    // https://docs.amplify.aws/lib/restapi/authz/q/platform/js#unauthenticated-requests
    /*const id= await Auth.currentSession().getIdToken().getJwtToken();
    this.setState({ id: id });
    */
  }


  render() {
    return (
      <div className="App">
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/calendarioPrenotazioni">Calendario prenotazioni</Link>
              </li>
              <li>
                <Link to="/gestisciPrenotazioni">Gestisci prenotazioni</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Container>
            <div className="spinnerContainer">
              <div className="spinner">
                <CircularProgress disableShrink />
              </div>
            </div>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/calendarioPrenotazioni" component={CalendarioPrenotazioni} />
              <Route path="/prenotazioniDelGiorno" component={PrenotazioniDelGiorno} />
              <Route path="/gestisciPrenotazioni" component={GestisciPrenotazioni} />
            </Switch>
          </Container>
        </div>
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