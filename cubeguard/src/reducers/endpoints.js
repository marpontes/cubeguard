import {
    GET_ENDPOINTS
} from '../actions/types';

export default function(state = null, action) {
    switch(action.type) {
        case GET_ENDPOINTS :
          return action.payload;
        default :
          return state;
    }
}