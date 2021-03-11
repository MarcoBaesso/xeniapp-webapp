import { combineReducers } from 'redux';
import todos from './reducers/todos';
import prenotazioniDelGiorno from './reducers/prenotazioniDelGiorno';
import viaggiDelGiorno from './reducers/viaggiDelGiorno';
import loading from './reducers/loading';

export default combineReducers({
  prenotazioniDelGiorno,
  viaggiDelGiorno,
  loading,
  todos/*,
  counter*/
})