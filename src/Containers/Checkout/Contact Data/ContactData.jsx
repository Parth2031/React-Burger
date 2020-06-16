// TODO:: Managing Global State using React Redux :-

import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../Components/UI/Button/Button';
import Spinner from '../../../Components/UI/Spinner/Spinner';
import Input from '../../../Components/UI/Input/Input';
import classes from './ContactData.module.css';
import { updateObject } from '../../../Shared/Utility';
import { checkValidity } from '../../../Shared/Validation';
import * as actionCreators from '../../../Store/Actions/actionIndex';
import axios from '../../../axios-order';
import withErrorHandler from '../../../HigerOrderComponents/withErrorHandler/withErrorHandler';

const ContactData = (props) =>
{
  const [orderForm, setOrderForm] = useState(
  {
    name:
    {
      elementType: 'input',
      elementConfig:
      {
        type: 'text',
        placeholder: 'Your Name'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    street:
    {
      elementType: 'input',
      elementConfig:
      {
        type: 'text',
        placeholder: 'Street'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    zipCode:
    {
      elementType: 'input',
      elementConfig:
      {
        type: 'text',
        placeholder: 'ZIP Code'
      },
      value: '',
      validation:
      {
        required: true,
        minLength: 5,
        maxLength: 6
      },
      valid: false,
      touched: false
    },
    country:
    {
      elementType: 'input',
      elementConfig:
      {
        type: 'text',
        placeholder: 'Country'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    email:
    {
      elementType: 'input',
      elementConfig:
      {
        type: 'email',
        placeholder: 'Your E-Mail'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    deliveryMethod:
    {
      elementType: 'select',
      elementConfig:
      {
        options: [
          { value: 'fastest', displayValue: 'Fastest' },
          { value: 'cheapest', displayValue: 'Cheapest' }
        ]
      },
      value: 'fastest',
      validation: {},
      valid: true
    }
  });
  
  const [formIsValid, setFormIsValid] = useState(false);

  // TODO:: Setting up the Data on Database (Firebase) and also Fetching it :- 

  const orderHandler = (event) =>
  {
    const formData = {};

    for (let formElementIdentifier in orderForm) {
      formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
    }

    const order =
    {
      ingredients: props.ings,
      price: props.price,             
      orderData: formData,
      userId: props.userId
    }

    props.onOrderBurger(order, props.token);

    event.preventDefault();
  }

  const inputChangedHandler = (event, inputIdentifier) =>
  {    
    const updatedFormElement = updateObject(orderForm[inputIdentifier],
    {
      value: event.target.value,
      valid: checkValidity(event.target.value, orderForm[inputIdentifier].validation),
      touched: true
    });
   
    const updatedOrderForm = updateObject(orderForm, { [inputIdentifier]: updatedFormElement });

    // console.log(updatedFormElement);

    let formIsValid = true;
    
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    
    setOrderForm(updatedOrderForm)
    setFormIsValid(formIsValid);
  }

  const formElementsArray = [];
    
  for (let key in orderForm)
  {
    formElementsArray.push(
    {
      id: key,
      config: orderForm[key]
    });
  }

  let form =
  (
    <form onSubmit={orderHandler}>
      { formElementsArray.map( formElement => (
        <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              invalid={!formElement.config.valid}
              shouldValidate={formElement.config.validation}
              touched={formElement.config.touched}                
              changed={(event) => inputChangedHandler(event, formElement.id)} />
      ))}
      <Button btnType="Success" disabled={!formIsValid}>ORDER</Button>
    </form>
  );
    
    if (props.loading) {
      form = <Spinner />;
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
}

// TODO:: Setting Up React Redux Linking -->>

const mapStateToProps = (state) =>
{
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  }
} 

const mapDispatchToProps = (dispatch) =>
{
  return {
    onOrderBurger: (orderData, token) => dispatch(actionCreators.purchaseBurger(orderData, token))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData, axios));