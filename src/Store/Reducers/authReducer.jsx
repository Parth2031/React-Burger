import * as actionTypes from '../Actions/actionTypes';
import { updateObject } from '../../Shared/Utility';

const intialState = 
{
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirectPath: '/'
}

const authSuccess = (state, action) =>
{
  return updateObject( state,
  {
    token: action.idToken,
    userId: action.userId,
    error: null,
    loading: false
  });
}

const authFail = (state, action) =>
{
  return updateObject( state, 
  {
    error: action.error,
    loading: false
  });
}

const reducer = (state = intialState, action) =>
{
  switch (action.type)
  {
    case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);

    case actionTypes.AUTH_FAIL: return authFail(state, action);
    
    case actionTypes.AUTH_START: return updateObject(state, { error: null, loading: true });
    
    case actionTypes.AUTH_LOGOUT: return updateObject(state, { token: null, userId: null });

    case actionTypes.SET_AUTH_REDIRECT_PATH: return updateObject(state, { authRedirectPath: action.path });

    default: return state;
  } 
}

export default reducer;