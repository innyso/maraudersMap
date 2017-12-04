// src/redux/index.js
import { combineReducers } from 'redux';
import homeReducer from './home';
import locationReducer from './location';

export default combineReducers({
  newWizard: homeReducer,
  location: locationReducer,
});

