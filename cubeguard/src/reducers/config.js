import {
    GET_CONFIG
} from '../actions/types';

export default function(state = null, action) {
    switch(action.type) {
        case GET_CONFIG :
          return action.payload;
        default :
          return state;
    }
}