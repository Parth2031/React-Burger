import * as actionTypes from './actionTypes';
import axios from '../../axios-order';

const purchaseBurgerSuccess = (id, orderData) =>
{
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData: orderData
  };
};

const purchaseBurgerFail = (error) =>
{
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error: error
  };
};

const purchaseBurgerStart = () =>
{
  return {
    type: actionTypes.PURCHASE_BURGER_START
  }
};  

export const purchaseBurger = (orderData, token) =>
{
  // ! /orders.json is the Format needed for Firebase Database as it stores in this format only.

  return (dispatch) =>
  {
    dispatch(purchaseBurgerStart());

    axios.post('/orders.json?auth=' + token, orderData)
      .then((response) =>
      {
        // console.log(response.data.name);

        dispatch(purchaseBurgerSuccess(response.data.name, orderData));     
       
      })
      .catch((error) =>
      {
        // console.log(error);

        dispatch(purchaseBurgerFail(error));
      });
  };
};

export const purchaseInitial = () =>
{
  return {
    type: actionTypes.PURCHASE_INTIAL
  };
};

const fetchOrdersSuccess = (orders) =>
{
  return {
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders: orders
  };
};

const fetchOrdersFail = (error) =>
{
  return {
    type: actionTypes.FETCH_ORDERS_FAIL,
    error: error
  };
};

const fetchOrdersStart = () =>
{
  return {
    type: actionTypes.FETCH_ORDERS_START
  };
};

export const fetchOrders = (token, userId) =>
{
  return (dispatch) => 
  {
    dispatch(fetchOrdersStart());

    const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';

    axios.get('/orders.json' + queryParams)
      .then( res =>
      {
        const fetchedOrders = [];

        for (let key in res.data)
        {
          fetchedOrders.push(
            {
              ...res.data[key],
              id: key
            });
        }

        dispatch(fetchOrdersSuccess(fetchedOrders));
      })

      .catch( (err) => {
        dispatch(fetchOrdersFail(err));
      });
  };
};