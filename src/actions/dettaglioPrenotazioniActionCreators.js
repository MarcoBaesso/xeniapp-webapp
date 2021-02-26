export function set({prenotazioni, date}) {
    return {
        type: 'SET',
        prenotazioni: prenotazioni,
        date: date
    }
}
  
export function get() {
    return {
        type: 'GET'
    }
}