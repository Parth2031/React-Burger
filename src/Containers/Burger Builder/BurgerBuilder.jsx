// TODO:: Managing Global State using React Redux :-

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Auxiliary from '../../HigerOrderComponents/Auxiliary/Auxiliary';
import withErrorHandler from '../../HigerOrderComponents/withErrorHandler/withErrorHandler';
import Burger from '../../Components/Burger/Burger';
import BuildControls from '../../Components/Burger/Build Controls/BuildControls';
import Modal from '../../Components/UI/Modal/Modal';
import OrderSummary from '../../Components/Burger/Order Summary/OrderSummary';
import Spinner from '../../Components/UI/Spinner/Spinner';
import axios from '../../axios-order';
import * as actionCreators from '../../Store/Actions/actionIndex';

const BurgerBuilder = (props) =>
{
  const [purchasing, setPurchasing] = useState(false);
  
  const dispatch = useDispatch();

  const ings = useSelector( (state) => {
    return state.burgerBuilder.ingredients;
  });
  const price = useSelector( (state) => state.burgerBuilder.totalPrice);
  const error = useSelector( (state) => state.burgerBuilder.error);
  const isAuthenticated = useSelector( (state) => state.auth.token !== null);  

  const onIngredientAdded = (ingName) => dispatch(actionCreators.addIngredient(ingName));
  const onIngredientRemoved = (ingName) => dispatch(actionCreators.removeIngredient(ingName));
  const onIntializeIngredients = useCallback( () => dispatch(actionCreators.initializeIngredient()), [dispatch]);
  const onIntialPurchase =  () => dispatch(actionCreators.purchaseInitial());
  const onSetAuthRedirectPath = (path) => dispatch(actionCreators.setAuthRedirectPath(path));  

  useEffect(() => {
    onIntializeIngredients();
  }, [onIntializeIngredients]);

  const updatePurchaseState = (ingredients) =>
  {
    const sum = Object.keys(ingredients)
      .map( ingredientKey => {
        return ingredients[ingredientKey];
      })
      .reduce( (sum, element) => {
        return sum + element;
      }, 0);
    
    return sum > 0;
  }

  const purchaseHandler = () =>
  {
    if (isAuthenticated) {
      setPurchasing(true);
    } 

    else
    {
      onSetAuthRedirectPath('/checkout');
      props.history.push('/authentication');
    }
  }

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  }

  const purchaseContinueHandler = () =>
  {    
    onIntialPurchase();
    props.history.push( '/checkout');
  }

  const disabledInfo = {
    ...ings
  };

  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0       // ! In this format, {salad: true, meat: false, ...}
  }

  let orderSummary = null;
  let burger = error ? <p style={{ textAlign: 'center' }}>Ingredients can't be loaded!</p> : <Spinner />;

  if (ings)
  {
    burger =
    (
      <Auxiliary>
        <Burger ingredients={ings} />                                
        <BuildControls
          ingredientAdded={onIngredientAdded}                        
          ingredientRemoved={onIngredientRemoved}                    
          disabled={disabledInfo}
          purchasable={updatePurchaseState(ings)}               
          ordered={purchaseHandler}
          isAuth={isAuthenticated}
          price={price} />                                           
      </Auxiliary>  
    );
    
    orderSummary = <OrderSummary
                      ingredients={ings}
                      price={price}
                      purchaseCancelled={purchaseCancelHandler}
                      purchaseContinued={purchaseContinueHandler} /> 
  }  


  return (
    <Auxiliary>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}      
      </Modal> 
      {burger}
    </Auxiliary>
  );
}

export default withErrorHandler(BurgerBuilder,axios);