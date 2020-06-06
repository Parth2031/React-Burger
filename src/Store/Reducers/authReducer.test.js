import reducer from './authReducer';
import * as actionTypes from '../Actions/actionTypes';

describe('Auth Reducer', () =>
{
  it('Should return the Initial State', () =>
  {
    expect(reducer(undefined, {})).toEqual(
    {
      token: null,
      userId: null,
      error: null,
      loading: false,
      authRedirectPath: '/'
    });
  });

  it('Should store the Token upon Login', () =>
  {
    expect(reducer(
    {
      token: null,
      userId: null,
      error: null,
      loading: false,
      authRedirectPath: '/'
    }, 
    {
      type: actionTypes.AUTH_SUCCESS,
      idToken: 'some-token',
      userId: 'some-user-id'
    })).toEqual(
       {
         token: 'some-token',
         userId: 'some-user-id',
         error: null,
         loading: false,
         authRedirectPath: '/'
    });
  })
});
