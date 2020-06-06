// TODO:: Managing Global State using React Redux :-

import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../Components/Order/Checkout Summary/CheckoutSummary';
import ContactData from './Contact Data/ContactData';
import Auxiliary from '../../HigerOrderComponents/Auxiliary/Auxiliary';

class Checkout extends Component
{
  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  }

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  }

  render()
  {
    let summary = <Redirect to="/" />

    if (this.props.ings)
    {
      const purchasedRedirect = this.props.purchased ? <Redirect to="/" /> : null; 

      summary = (
        <Auxiliary>
          {purchasedRedirect}
          <CheckoutSummary
            ingredients={this.props.ings}
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinued={this.checkoutContinuedHandler} />
          <Route
            path={this.props.match.path + '/contact-data'}
            component={ContactData} /> 
        </Auxiliary>  
      );
    }

    return summary;
  }
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