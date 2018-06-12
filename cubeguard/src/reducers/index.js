import { combineReducers } from 'redux';
import schema from './schema';
import config from './config';
import endpoints from './endpoints';

const rootReducer = combineReducers({schema, config, endpoints});

export default rootReducer;
