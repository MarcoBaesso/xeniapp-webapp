export default function loading(state = {counter: 0}, action) {
    switch (action.type) {
      case 'INCREMENT':
        return {
          counter: state.counter+1
        };
      case 'DECREMENT':
        const counter= state.counter<=0? 0 : state.counter-1;
        return {
          counter: counter
        };
      default:
        return state
    }
  }