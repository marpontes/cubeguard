import { GET_CONFIG } from './types';
import Config from '../config';

const headers = Config.HEADERS;

export function getConfig() {

    return function(dispatch) {

        const url = `${Config.API_URL}plugin/cubeguard/api/getconfig`;
        fetch(url,{ method: "GET", headers })
        .then(res => { 
            res.json().then(payload=>{
                dispatch({ type: GET_CONFIG, payload });
            })
        })
        .catch( err =>{ console.log(err) });

    }
}

export function setConfig() {

    return function(dispatch) {

        const url = `${Config.API_URL}plugin/cubeguard/api/setconfig`;
        fetch(url,{ method: "POST", headers })
        .then(res => { 
            dispatch(getConfig());
        })
        .catch( err =>{ console.log(err) });
    }
}
