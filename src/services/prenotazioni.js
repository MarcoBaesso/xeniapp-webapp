

import {Auth} from 'aws-amplify';

class PrenotazioniService {
    //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    async get(month){
      /*
        const myInit = { 
            headers: { 
              Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
            },
          };*/        
        const response = await fetch("http://localhost:3000/Prod/struttura/prenotazione", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'strict-origin-when-cross-origin', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          });
          return response.json(); // parses JSON response into native JavaScript objects        
    }

}

export default PrenotazioniService;