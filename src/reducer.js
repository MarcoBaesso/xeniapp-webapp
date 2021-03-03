import { combineReducers } from 'redux';
import todos from './reducers/todos';
import prenotazioniDelGiorno from './reducers/prenotazioniDelGiorno';
import loading from './reducers/loading';

export default combineReducers({
  prenotazioniDelGiorno,
  loading,
  todos/*,
  counter*/
})