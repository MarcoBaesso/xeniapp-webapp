export default function prenotazioniDelGiorno(state = {}, action) {
    switch (action.type) {
      case 'SET':
        return {
          prenotazioni: action.prenotazioni,
          date: action.date
        };
      case 'GET':
        return state;
      default:
        return state
    }
  }