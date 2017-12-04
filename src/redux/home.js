import { registerNewWizard } from '../apiCalls';

const REGISTER_WIZARD_START = 'REGISTER_WIZARD_START';
const REGISTER_WIZARD_SUCCESS = 'REGISTER_WIZARD_SUCCESS';
const REGISTER_WIZARD_FAIL = 'REGISTER_WIZARD_FAIL';

export const registerWizard = name => (dispatch) => {
  dispatch({ type: REGISTER_WIZARD_START });
  return registerNewWizard(name)
    .then(() => dispatch({ type: REGISTER_WIZARD_SUCCESS }))
    .catch(error => dispatch({ type: REGISTER_WIZARD_FAIL, error }));
};

const initialState = {
  isRegistering: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_WIZARD_START:
      return {
        ...state,
        isRegistering: true,
        error: null,
      };
    case REGISTER_WIZARD_SUCCESS:
      return {
        ...state,
        isRegistering: false,
        error: null,
      };
    case REGISTER_WIZARD_FAIL:
      return {
        ...state,
        isRegistering: false,
        error: action.error,
      };
    default:
      return state;
  }
};
