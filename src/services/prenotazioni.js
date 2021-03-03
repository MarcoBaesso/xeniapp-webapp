

import {Auth} from 'aws-amplify';
import { keys, forEach } from 'ramda';

class PrenotazioniService {
    //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    async get(stati, mese){
      /*
        const myInit = { 
            headers: { 
              Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
            },
          };*/
        const url = new URL("http://localhost:3000/Prod/struttura/prenotazione");
        const params = {stati: stati, mese: mese};
        forEach(param => url.searchParams.append(param, params[param]), keys(params));

        const response = await fetch(url, {
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

    async updateStato(emailUtente, idPrenotazione, statoPrenotazione, motivoRifiuto){
      /*
        const myInit = { 
            headers: { 
              Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
            },
          };*/
        const url = new URL("http://localhost:3000/Prod/struttura/prenotazione");

        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
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
            body: JSON.stringify({
              
              'emailUtente': emailUtente,
              'idPrenotazione': idPrenotazione,
              'statoPrenotazione': statoPrenotazione,
              'motivoRifiuto': motivoRifiuto
            })
          });

          return response.ok; // parses JSON response into native JavaScript objects        
    }

}

export default PrenotazioniService;