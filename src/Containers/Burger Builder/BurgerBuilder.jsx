// TODO:: Managing Global State using React Redux :-

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auxiliary from '../../HigerOrderComponents/Auxiliary/Auxiliary';
import withErrorHandler from '../../HigerOrderComponents/withErrorHandler/withErrorHandler';
import Burger from '../../Components/Burger/Burger';
import BuildControls from '../../Components/Burger/Build Controls/BuildControls';
import Modal from '../../Components/UI/Modal/Modal';
import OrderSummary from '../../Components/Burger/Order Summary/OrderSummary';
import Spinner from '../../Components/UI/Spinner/Spinner';
import axios from '../../axios-order';
import * as actionCreators from '../../Store/Actions/actionIndex';

export class BurgerBuilder extends Component 
{
  // constructor(props)
  // {
  //   super(props);
  //   this.state = {};
  // }

  state =
  {
    // ! Defining Ingredients ->
     
    // ingredients: 
    // {
    //   salad: 0,
    //   bacon: 0,
    //   cheese: 0,
    //   meat: 0
    // },

    // ! Fetched Ingredients from Database but now, it is handled in React Redux as they Global State ->>
    // * Price is set in React Redux Store are set according to the Ingredients Type ->
    // ? Whereas, Purchasable State is converted to a Local UI State using a Boolean Function ->

    // ingredients:null,
    // totalPrice: 4,
    // purchasable: false,
    
    purchasing: false
    // loading: false,
    // error: false
  }
  
  componentDidMount()
  {
    // console.log(this.props);
  
    this.props.onIntializeIngredients();
  }

  // // ---------------------------------------------------------------------------------------------------------------------------

  // ! Below Code used to update the State which could be now done using React Redux for better State Management -

  // addIngredientHandler = (type) =>
  // {
  //   const oldCount = this.state.ingredients[type];
  //   const updatedCount = oldCount + 1;
    
  //   const updatedIngredients = {
  //     ...this.state.ingredients
  //   };
  
  //   updatedIngredients[type] = updatedCount;
  
  //   const priceAddition = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newPrice = oldPrice + priceAddition;
  
  //   this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
  //   this.updatePurchaseState(updatedIngredients);
  // }


  // removeIngredientHandler = (type) =>
  // {
  //   const oldCount = this.state.ingredients[type];
  
  //   if (oldCount <= 0) {
  //     return;
  //   }
  
  //   const updatedCount = oldCount - 1;
  //   const updatedIngredients = {
  //     ...this.state.ingredients
  //   };
  
  //   updatedIngredients[type] = updatedCount;
  
  //   const priceDeduction = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newPrice = oldPrice - priceDeduction;
  
  //   this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
  //   this.updatePurchaseState(updatedIngredients);
  // }

  // // ---------------------------------------------------------------------------------------------------------------------------

  // ! updatePurchaseState is a Local UI State which is used only as a boolean value instead of setting a State ->

  updatePurchaseState (ingredients)
  {
    const sum = Object.keys(ingredients)
      .map( ingredientKey => {
        return ingredients[ingredientKey];
      })
      .reduce( (sum, element) => {
        return sum + element;
      }, 0);
    
    // this.setState({ purchasable: sum > 0 });

    return sum > 0;
  }

  purchaseHandler = () =>
  {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true });
    } 

    else
    {
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push('/authentication');
    }
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  }

  purchaseContinueHandler = () =>
  {    
    this.props.onIntialPurchase();
    this.props.history.push( '/checkout');
  }

  render()
  {
    const disabledInfo = {
      ...this.props.ings
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0       // ! In this format, {salad: true, meat: false, ...}
    }

    let orderSummary = null;
    let burger = this.props.error ? <p style={{ textAlign: 'center' }}>Ingredients can't be loaded!</p> : <Spinner />;

    if (this.props.ings)
    {
      burger =
      (
        <Auxiliary>
          <Burger ingredients={this.props.ings} />                                
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}                        
            ingredientRemoved={this.props.onIngredientRemoved}                    
            disabled={disabledInfo}
            purchasable={this.updatePurchaseState(this.props.ings)}               
            ordered={this.purchaseHandler}
            isAuth={this.props.isAuthenticated}
            price={this.props.price} />                                           
        </Auxiliary>  
      );
      
      orderSummary = <OrderSummary
                        ingredients={this.props.ings}
                        price={this.props.price}
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler} /> 
    }  

    // if (this.state.loading) {
    //   orderSummary = <Spinner />;
    // }

    return (
      <Auxiliary>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}      
        </Modal> 
        {burger}
      </Auxiliary>
    );
  }
}

// TODO:: Setting Up React Redux Linking -->>

const mapStateToProps = (state) =>
{
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  }
} 

const mapDispatchToProps = (dispatch) =>
{
  return {
    onIngredientAdded: (ingName) => dispatch(actionCreators.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(actionCreators.removeIngredient(ingName)),
    onIntializeIngredients: () => dispatch(actionCreators.initializeIngredient()),
    onIntialPurchase: () => dispatch(actionCreators.purchaseInitial()),
    onSetAuthRedirectPath: (path) => dispatch(actionCreators.setAuthRedirectPath(path))  
  }
}  

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios));