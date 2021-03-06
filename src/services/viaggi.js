

import {Auth} from 'aws-amplify';
import { keys, forEach } from 'ramda';

import store from '../store';
import * as Loading from '../actions/loading';

class ViaggiService {
    //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    async get(stati, annoMese){
      /*
        const myInit = { 
            headers: { 
              Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
            },
          };*/
          try{
        
        store.dispatch(Loading.increment());

        const url = new URL("http://localhost:3000/Prod/struttura/viaggio");
        const params = {stati: stati, annoMese: annoMese};
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
          store.dispatch(Loading.decrement());
          return response.json(); // parses JSON response into native JavaScript objects       
        } catch (e){
          store.dispatch(Loading.decrement()); 
        }
    }

    /*
    async updateStato(emailUtente, idPrenotazione, statoPrenotazione, motivoRifiuto){
          try{
        
            store.dispatch(Loading.increment());
        const url = new URL("http://localhost:3000/Prod/struttura/viaggio");

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

          store.dispatch(Loading.decrement());
          return response.ok; // parses JSON response into native JavaScript objects        
        } catch (e){
          store.dispatch(Loading.decrement()); 
        }
      }*/

}

export default ViaggiService;