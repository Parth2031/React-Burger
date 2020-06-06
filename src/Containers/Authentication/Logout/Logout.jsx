import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actionCreators from '../../../Store/Actions/actionIndex';

class Logout extends Component 
{
  componentDidMount() {
    this.props.onLogout();
  }

  render()
  {
    return <Redirect to="/" />;
  }
}

const mapDispatchToProps = (dispatch) =>
{
  return {
    onLogout: () => dispatch(actionCreators.authLogout())
  };
}

export default connect(null,mapDispatchToProps)(Logout);