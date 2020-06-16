import React, { Suspense, useEffect } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'; 
import { connect } from 'react-redux';

import Layout from '../src/HigerOrderComponents/Layouts/Layout';
import BurgerBuilder from './Containers/Burger Builder/BurgerBuilder';
import Logout from './Containers/Authentication/Logout/Logout';
import * as actionCreators from './Store/Actions/actionIndex';

const AsyncCheckout = React.lazy( () => {
  return import('../src/Containers/Checkout/Checkout');
});  

const AsyncOrders = React.lazy( () => {
  return import('../src/Containers/Orders/Orders');
});  

const AsyncAuthentication = React.lazy( () => {
  return import('./Containers/Authentication/Authentication');
});  

const App = (props) =>
{
  useEffect(() => {
    props.onTryAutoSignUp();
   }, [props]);

  let routes = (
    <Switch>
      <Route path="/authentication" render={(props) => <AsyncAuthentication {...props} />} />
      <Route path="/" exact component={BurgerBuilder} />
      <Redirect to="/"/>
    </Switch>  
  );

  if (props.isAuthenticated)
  {
    routes =
    (
      <Switch>
        <Route path="/checkout" render={(props) => <AsyncCheckout {...props} />} />
        <Route path="/orders" render={(props) => <AsyncOrders {...props} />} />
        <Route path="/logout" component={Logout} />
        <Route path="/authentication" render={(props) => <AsyncAuthentication {...props} />} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <Layout>
      <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
    </Layout>
  );
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
