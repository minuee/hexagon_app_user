import { combineReducers } from 'redux';
import StatusReducer from './statusReducer';


export default combineReducers({
    GlabalStatus: StatusReducer
});
