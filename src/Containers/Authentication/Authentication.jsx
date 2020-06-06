// TODO:: Adding Authentication to Webpages :-

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Input from '../../Components/UI/Input/Input';
import Button from '../../Components/UI/Button/Button';
import Spinner from '../../Components/UI/Spinner/Spinner';
import classes from './Authentication.module.css';
import { updateObject } from '../../Shared/Utility';
import { checkValidity } from '../../Shared/Validation';
import * as actionCreators from '../../Store/Actions/actionIndex';

class Authentication extends Component 
{
  state =
  {
    controls: 
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
    },
    isSignUp: true 
  }

  componentDidMount()
  {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
      this.props.onSetAuthRedirectPath();
    } 
  }

  inputChangedHandler = (event, controlName) =>
  {
    const updatedControls = updateObject( this.state.controls,
    {
      [controlName]: updateObject( this.state.controls[controlName],
      {
        value: event.target.value,
        valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
        touched: true
      })
    });

    this.setState({ controls: updatedControls });
  } 
  
  submitHandler = (event) =>
  {
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
    event.preventDefault();
  }

  switchAuthModeHandler = () => {
    this.setState((prevState) => { return { isSignUp: !prevState.isSignUp } });
  }

  render()
  {
    const formElementsArray = [];
    
    for (let key in this.state.controls)
    {
      formElementsArray.push(
      {
        id: key,
        config: this.state.controls[key]
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
            changed={(event) => this.inputChangedHandler(event, formElement.id)} />
    ));

    if (this.props.loading) 
      form = <Spinner /> 

    let errorMessage = null;

    if (this.props.error) {
      errorMessage = ( <p>{this.props.error.message}</p> )
    }
    
    let authRedirect = null;

    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectPath}/>
    }

    return (
      <div className={classes.Authentication}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">Submit</Button>
        </form>
        <Button clicked={this.switchAuthModeHandler} btnType="Danger"> Switch to {this.state.isSignUp ? 'Sign-In' : 'Sign-Up'}</Button>
      </div>
    );
  }
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