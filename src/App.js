// TODO:: This project is based on Class Based React till now.

import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'; 
import { connect } from 'react-redux';
import asyncComponent from './HigerOrderComponents/asyncComponent/asyncComponent';

// import './App.module.css';
import Layout from '../src/HigerOrderComponents/Layouts/Layout';
import BurgerBuilder from './Containers/Burger Builder/BurgerBuilder';
// import Checkout from '../src/Containers/Checkout/Checkout';
// import Orders from '../src/Containers/Orders/Orders';
// import Authentication from './Containers/Authentication/Authentication';
import Logout from './Containers/Authentication/Logout/Logout';
import * as actionCreators from './Store/Actions/actionIndex';

const asyncCheckout = asyncComponent( () => {
  return import('../src/Containers/Checkout/Checkout');
});  

const asyncOrders = asyncComponent( () => {
  return import('../src/Containers/Orders/Orders');
});  

const asyncAuthentication = asyncComponent( () => {
  return import('./Containers/Authentication/Authentication');
});  

class App extends Component
{
  componentDidMount() {
    this.props.onTryAutoSignUp();
  }

  render()
  {
    let routes = (
      <Switch>
        <Route path="/authentication" component={asyncAuthentication} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/"/>
      </Switch>  
    );

    if (this.props.isAuthenticated) {
      routes =
      (
        <Switch>
          <Route path="/checkout" component={asyncCheckout} />
          <Route path="/orders" component={asyncOrders} />
          <Route path="/logout" component={Logout} />
          <Route path="/authentication" component={asyncAuthentication} />
          <Route path="/" exact component={BurgerBuilder} />
          <Redirect to="/" />
        </Switch>
      );
    }

    return (
      <Layout>
        {routes}
      </Layout>
    );
  }
}

const mapStateToProps = (state) =>
{
  return {
    isAuthenticated: state.auth.token !== null
  };
}

const mapDispatchToProps = (dispatch) =>
{
  return {
    onTryAutoSignUp: () => dispatch(actionCreators.authCheckState())
  };
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
