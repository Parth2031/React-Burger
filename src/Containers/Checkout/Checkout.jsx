// TODO:: Managing Global State using React Redux :-

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../Components/Order/Checkout Summary/CheckoutSummary';
import ContactData from './Contact Data/ContactData';
import Auxiliary from '../../HigerOrderComponents/Auxiliary/Auxiliary';

const Checkout = (props) =>
{
  const checkoutCancelledHandler = () => {
    props.history.goBack();
  }

  const checkoutContinuedHandler = () => {
    props.history.replace('/checkout/contact-data');
  }

  let summary = <Redirect to="/" />

  if (props.ings)
  {
    const purchasedRedirect = props.purchased ? <Redirect to="/" /> : null; 

    summary = (
      <Auxiliary>
        {purchasedRedirect}
        <CheckoutSummary
          ingredients={props.ings}
          checkoutCancelled={checkoutCancelledHandler}
          checkoutContinued={checkoutContinuedHandler} />
        <Route path={props.match.path + '/contact-data'} component={ContactData} /> 
      </Auxiliary>  
    );
  }

  return summary;
}

// TODO:: Setting Up React Redux Linking -->>

const mapStateToProps = (state) =>
{
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased
  };
} 

export default connect(mapStateToProps)(Checkout);