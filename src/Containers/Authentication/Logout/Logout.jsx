import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actionCreators from '../../../Store/Actions/actionIndex';

const Logout = (props) =>
{
  const { onLogout } = props;

  useEffect( () => { 
    onLogout();
  }, [onLogout]);   

  return <Redirect to="/" />;  
}

const mapDispatchToProps = (dispatch) =>
{
  return {
    onLogout: () => dispatch(actionCreators.authLogout())
  };
}

export default connect(null,mapDispatchToProps)(Logout);