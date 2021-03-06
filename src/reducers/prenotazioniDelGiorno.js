export default function prenotazioniDelGiorno(state = {}, action) {
    switch (action.type) {
      case 'SET':
        return {
          prenotazioni: action.prenotazioni,
          data: action.data
        };
      case 'GET':
        return state;
      default:
        return state
    }
  }