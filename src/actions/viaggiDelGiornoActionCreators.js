export function set({viaggi, data, stato}) {
    return {
        type: 'SET',
        viaggi: viaggi,
        data: data,
        stato: stato
    }
}
  
export function get() {
    return {
        type: 'GET'
    }
}