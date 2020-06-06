import React from 'react';
import classes from './Burger.module.css';
import Ingredients from '../Burger/Ingredients/Ingredients';
// import Auxiliary from '../../HigerOrderComponents/Auxiliary/Auxiliary';

const burger = (props) =>
{
  let transformedIngredients = Object.keys(props.ingredients)
    .map(ingredientKey =>
    {
      return [...Array(props.ingredients[ingredientKey])].map( (_, index) => {
        return <Ingredients key={ingredientKey + index} type={ingredientKey} />;
      });
    })
      
    .reduce((array, element) => {
      return array.concat(element)
    }, []);
  
  if (transformedIngredients.length === 0) {
    transformedIngredients = <p style={{ color: "blue" }}>Please start adding Ingredients!</p>;
  }

  // console.log(transformedIngredients);

  return (
    <div className={classes.Burger}>
      <Ingredients type="bread-top" />
      {transformedIngredients}
      {/* <Ingredients type="cheese" />
      <Ingredients type="meat" />
      <Ingredients type="salad" />
      <Ingredients type="bacon" /> */}
      <Ingredients type="bread-bottom" />
    </div>
  );
}

export default burger;