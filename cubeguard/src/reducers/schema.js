import {
    GET_SCHEMAS,
    GET_SCHEMA,
    SET_SCHEMA
} from '../actions/types';

export default function(state = {schemas: [], current:null}, action) {
    switch(action.type) {
        case GET_SCHEMAS :
          return { ...state, schemas: [...action.payload]};
        case GET_SCHEMA  :
          return { ...state, current: action.payload};
        case SET_SCHEMA  :
          return { ...state, current: action.payload.data};
        default :
          return state;
    }
}