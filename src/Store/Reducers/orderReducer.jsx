import * as actionTypes from '../Actions/actionTypes';
import { updateObject } from '../../Shared/Utility';

const intialState =
{
  orders: [],
  loading: false,
  purchased: false
};

const purchaseBurgerSuccess = (state, action) =>
{
  const newOrder = updateObject(action.orderData, { id: action.orderId });
  return updateObject( state,
  {
    loading: false,
    purchased: true,
    orders: state.orders.concat(newOrder)
  });
}

const fetchOrderSuccess = (state, action) =>
{
  return updateObject( state,
  {
    orders: action.orders,
    loading: false
  });
}

const reducer = (state = intialState, action) =>
{
  switch (action.type)
  {
    case actionTypes.PURCHASE_BURGER_SUCCESS: return purchaseBurgerSuccess(state, action);
      
    case actionTypes.PURCHASE_BURGER_FAIL: return updateObject(state, { loading: false });
    
    case actionTypes.PURCHASE_BURGER_START: return updateObject(state, { loading: true });
    
    case actionTypes.PURCHASE_INTIAL: return updateObject(state, { purchased: false });
    
    case actionTypes.FETCH_ORDERS_SUCCESS: return fetchOrderSuccess(state, action);

    case actionTypes.FETCH_ORDERS_FAIL: return updateObject(state, { loading: false });
    
    case actionTypes.FETCH_ORDERS_START: return updateObject(state, { loading: true });

    default: return state;
  }
}

export default reducer;