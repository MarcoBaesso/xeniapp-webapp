import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';

// TODO: crea dei file awsconfig specifici per ambiente
Amplify.configure(awsconfig);
// https://react-redux.js.org/introduction/quick-start
// https://redux.js.org/api/bindactioncreators

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
