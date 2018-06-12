import { GET_ENDPOINTS } from './types';
import Config from '../config';

const headers = Config.HEADERS;

export function getEndpoints() {

    return function(dispatch) {

        const url = `${Config.API_URL}plugin/cubeguard/api/refresh`;
        fetch(url,{ 
            method: "GET", 
            headers: {Authorization: headers.Authorization}
        } )
        .then(res => { 
            res.text().then(txt => {
                dispatch({
                    type: GET_ENDPOINTS,
                    payload: _endpointsToArray(txt)
                })
            })
        })
        .catch( err =>{ console.log(err) });

    }
}

function _endpointsToArray(txt){
    if (txt === null || txt === undefined || typeof txt !== 'string' ){
        return [];
    }
    var arr = txt.split('\n')
        .filter(_isEndpointLine)
        .map(mapEndpointProperties)
        .filter(onlyKettleEndpoints)
        .map(e=>e.name);
    return arr;
}

function _isEndpointLine(line){
    return line !== undefined 
        && line !== null 
        && line !== '' 
        && line.match(/^\s*\[\w/)!==null;
}

function mapEndpointProperties(l){
    let parts = l.split(":").map(part=>part.trim());
    let namePart = parts[0];
    let propsPart = parts[1].substring(1,parts[1].length-2).split(',')
        .map(prop => {
        let assign = prop.split('=').map(part=>part.trim());
        return { key: assign[0], value:assign[1] };
        });
    return {
        name: namePart.substring(1,namePart.length-1),
        type: propsPart.filter(typeFilter).map(p=>p.value).join('')
    };
}

function onlyKettleEndpoints(l){
    return l.type === 'Kettle';
}

function typeFilter(props){
    return props.key === 'type';
}