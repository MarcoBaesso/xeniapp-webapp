import { combineReducers } from 'redux';
import todos from './reducers/todos';
import dettaglioPrenotazioni from './reducers/dettaglioPrenotazioni';

export default combineReducers({
  dettaglioPrenotazioni,
  todos/*,
  counter*/
})