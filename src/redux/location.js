import { updateLocation } from '../apiCalls';

const UPDATE_LOCATION_START = 'UPDATE_LOCATION_START';
const UPDATE_LOCATION_SUCCESS = 'UPDATE_LOCATION_SUCCESS';
const UPDATE_LOCATION_FAIL = 'UPDATE_LOCATION_FAIL';

export const updateLocationApi = location => (dispatch) => {
  dispatch({ type: UPDATE_LOCATION_START });
  return updateLocation(location)
    .then(() => dispatch({ type: UPDATE_LOCATION_SUCCESS }))
    .catch(error => dispatch({ type: UPDATE_LOCATION_FAIL, error }));
};

const initialState = {
  isUpdating: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LOCATION_START:
      return {
        ...state,
        isUpdating: true,
        error: null,
      };
    case UPDATE_LOCATION_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        error: null,
      };
    case UPDATE_LOCATION_FAIL:
      return {
        ...state,
        isUpdating: false,
        error: action.error,
      };
    default:
      return state;
  }
};
