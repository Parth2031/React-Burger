import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Order from '../../Components/Order/Order';
import Spinner from '../../Components/UI/Spinner/Spinner';
import * as actionCreators from '../../Store/Actions/actionIndex';
import axios from '../../axios-order';
import withErrorHandler from '../../HigerOrderComponents/withErrorHandler/withErrorHandler';

const Orders = ( props ) =>
{
  const { onFetchOrders } = props;

  useEffect(() => { 
    onFetchOrders(props.token, props.userId);
  }, [props.token, props.userId, onFetchOrders]); 

  let orders = <Spinner />;

  if (!props.loading)
  {
    orders = props.orders.map( order => (
              <Order
                key={order.id}
                ingredients={order.ingredients}
                price={order.price} />
            ))
  }  

  return <div> {orders} </div>
}

const mapStateToProps = (state) =>
{
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
}

const mapDispatchToProps = (dispatch) =>
{
  return {
    onFetchOrders: (token, userId) => dispatch(actionCreators.fetchOrders(token, userId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));