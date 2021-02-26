export default function prenotazioniDelGiorno(state = {}, action) {
    switch (action.type) {
      case 'SET':
        state.prenotazioni= action.prenotazioni;
        state.date= action.date;
        return state;
      case 'GET':
        return state;
      default:
        return state
    }
  }