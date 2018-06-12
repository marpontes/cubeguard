import { GET_SCHEMAS } from './types';
import Config from '../config';
const headers = Config.HEADERS;

function propsToJson(props){
    props = props.split(';').filter(s=>s!=='');
    var obj = {};
    props.forEach(prop => {
        let [key, val] = prop.split('=');
        obj[key] = val.replace(/"/g,'');
    });
    return obj;
}

function jsonToProps(obj) {
    return Object.keys(obj)
        .map( k=>k+'='+obj[k] )
        .join(';')+';';
}

function _getSchemasHandler( res, dispatch ) {
    let dataSources = [];
    res.json().then( ({Item}) => {
        let promises = Item.map((c, i) => {
            const DS = c.$;
            const detailsUrl = `${Config.API_URL}plugin/data-access/api/datasource/${DS}/getAnalysisDatasourceInfo`;
            dataSources[i] = DS;
            return fetch(detailsUrl, { method: "GET", headers });
        });
        Promise.all(promises)
        .then(responses => {
            return Promise.all(responses.map((r, i) => {
                return r.text();
            })) ;
        })
        .then(responses => {
            let payload = responses.map((ds, i) => {
                return { id: dataSources[i], data: propsToJson(ds) };
            });
            dispatch({ type: GET_SCHEMAS, payload });
        });
    });
}

export function getSchemas() {

    return function(dispatch) {

        const url = `${Config.API_URL}plugin/data-access/api/datasource/analysis/ids`;
        fetch(url,{ method: "GET", headers })
        .then(res =>{ _getSchemasHandler( res, dispatch ) })
        .catch( err =>{ console.log(err) });

    }
}


function _getSchemaParameters(data){
    data = Object.assign({}, data);
    delete data["Provider"]
    data = jsonToProps(data);
    return data;
}

export function setSchema(schema) {

    var analysisId = schema.id;
    var data = new FormData();

    data.append("uploadAnalysis", new File([],{type:"application/octet-stream"}));
    data.append("catalogName",analysisId);
    data.append("origCatalogName",analysisId);
    data.append("parameters",_getSchemaParameters(schema.data));
    
    const url = `${Config.API_URL}plugin/data-access/api/mondrian/postAnalysis`;
    return function(dispatch) {

        fetch(url,{ 
            method: "POST", 
            body: data,
            headers: {
                Authorization: headers.Authorization
            }
        })
        .then(res =>{
            if(res.status === 200){
                res.text().then(response => {
                    dispatch(getSchemas());
                });    
            }else{
                console.log("Error");
                dispatch(getSchemas());
            }
        })
        .catch( err =>{ 
            dispatch(getSchemas());
            console.log(err) 
        });

    }
}
