// TODO:: Adding Authentication to Webpages :-

import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Input from '../../Components/UI/Input/Input';
import Button from '../../Components/UI/Button/Button';
import Spinner from '../../Components/UI/Spinner/Spinner';
import classes from './Authentication.module.css';
import { updateObject } from '../../Shared/Utility';
import { checkValidity } from '../../Shared/Validation';
import * as actionCreators from '../../Store/Actions/actionIndex';

const Authentication = (props) =>
{
  const [authForm, setAuthForm] = useState(
  {
    email:
    {
      elementType: 'input',
      elementConfig:
      {
        type: 'email',
        placeholder: 'E-Mail Address'
      },
      value: '',
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    password:
    {
      elementType: 'input',
      elementConfig:
      {
        type: 'password',
        placeholder: 'Password'
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    },
  });
  
  const [isSignUp, setIsSignUp] = useState(true);
  const { buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props;

  useEffect(() => {
    if (!buildingBurger && authRedirectPath !== '/') {
      onSetAuthRedirectPath();
    }
   }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);    

  const inputChangedHandler = (event, controlName) =>
  {
    const updatedControls = updateObject( authForm,
    {
      [controlName]: updateObject( authForm[controlName],
      {
        value: event.target.value,
        valid: checkValidity(event.target.value, authForm[controlName].validation),
        touched: true
      })
    });

    setAuthForm(updatedControls);
  } 
  
  const submitHandler = (event) =>
  {
    props.onAuth(authForm.email.value, authForm.password.value, isSignUp);
    event.preventDefault();
  }

  const switchAuthModeHandler = () => {
    setIsSignUp(!isSignUp);
  }

  const formElementsArray = [];
    
  for (let key in authForm)
  {
    formElementsArray.push(
    {
      id: key,
      config: authForm[key]
    });
  }

  let form = formElementsArray.map( (formElement) =>
  (
    <Input
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          invalid={!formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
          changed={(event) => inputChangedHandler(event, formElement.id)} />
  ));

  if (props.loading) 
    form = <Spinner /> 

  let errorMessage = null;

  if (props.error) {
    errorMessage = ( <p>{props.error.message}</p> )
  }
    
  let authRedirect = null;

  if (props.isAuthenticated) {
    authRedirect = <Redirect to={props.authRedirectPath}/>
  }

  return (
    <div className={classes.Authentication}>
      {authRedirect}
      {errorMessage}
      <form onSubmit={submitHandler}>
        {form}
        <Button btnType="Success">Submit</Button>
      </form>
      <Button clicked={switchAuthModeHandler} btnType="Danger"> Switch to {isSignUp ? 'Sign-In' : 'Sign-Up'}</Button>
    </div>
  );
}

const mapStateToProps = (state) =>
{
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  };
}

const mapDispatchToProps = (dispatch) =>
{
  return {
    onAuth: (email, password, isSignUp) => dispatch(actionCreators.auth(email, password, isSignUp)),
    onSetAuthRedirectPath: () => dispatch(actionCreators.setAuthRedirectPath('/'))  
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(Authentication);