export function set({prenotazioni, data}) {
    return {
        type: 'SET',
        prenotazioni: prenotazioni,
        data: data
    }
}
  
export function get() {
    return {
        type: 'GET'
    }
}