export function set({prenotazioni, data, stato}) {
    return {
        type: 'SET',
        prenotazioni: prenotazioni,
        data: data,
        stato: stato
    }
}
  
export function get() {
    return {
        type: 'GET'
    }
}