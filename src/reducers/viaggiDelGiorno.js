export default function prenotazioniDelGiorno(state = {}, action) {
    switch (action.type) {
      case 'SET':
        return {
          viaggi: action.viaggi,
          data: action.data,
          stato: action.stato
        };
      case 'GET':
        return state;
      default:
        return state
    }
  }