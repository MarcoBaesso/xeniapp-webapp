import { combineReducers } from 'redux';
import todos from './reducers/todos';
import prenotazioniDelGiorno from './reducers/prenotazioniDelGiorno';

export default combineReducers({
  prenotazioniDelGiorno,
  todos/*,
  counter*/
})