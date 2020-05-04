import React, {useCallback, useReducer, useEffect, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from './Search';
import useHttp from "../../hooks/http";

const ingredientReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients
        case 'ADD':
            return [...state, action.ingredient]
        case 'DELETE':
            return state.filter(ingredient => ingredient.id !== action.id)
        default:
            throw new Error('default')
    }
}

const Ingredients = () => {
    const [ingredients, ingredientsDispatch] = useReducer(ingredientReducer, [])
    const {
        isLoading,
        error,
        data,
        sendRequest,
        reqExtra,
        reqIdentifer,
        clear
    } = useHttp();

    useEffect(() => {
        if (!isLoading && !error && reqIdentifer === 'REMOVE_INGREDIENT') {
            ingredientsDispatch({ type: 'DELETE', id: reqExtra });
        } else if (!isLoading && !error && reqIdentifer === 'ADD_INGREDIENT') {
            ingredientsDispatch({
                type: 'ADD',
                ingredient: { id: data.name, ...reqExtra }
            });
        }
    }, [data, reqExtra, reqIdentifer, isLoading, error]);

    const addIngredient = useCallback((ingredient) => {
        sendRequest(
            'https://trash-ee426.firebaseio.com/ingredients.json',
            'POST',
            JSON.stringify(ingredient),
            ingredient,
            'ADD_INGREDIENT'
        );
    }, [sendRequest]);

    const removeIngredient = useCallback((ingredientID) => {
        sendRequest(
            `https://trash-ee426.firebaseio.com/ingredients/${ingredientID}.json`,
            'DELETE',
            null,
            ingredientID,
            'REMOVE_INGREDIENT'
        )
    }, [sendRequest])

    const filterIngredients = useCallback((filteredIngredients) => {
        ingredientsDispatch({type: 'SET', ingredients: filteredIngredients})
    }, [])

    const ingredientList = useMemo(() => {
        return (
            <IngredientList
                ingredients={ingredients}
                onRemoveItem={removeIngredient}
            />
        );
    }, [ingredients, removeIngredient]);

    return (
        <div className="App">
            {error ? <ErrorModal onClose={clear}>{error}</ErrorModal> : null}
            <IngredientForm addIngredient={addIngredient} isLoading={isLoading}/>

            <section>
                <Search onLoadIngredients={filterIngredients}/>
                {ingredientList}
            </section>
        </div>
    );
}

export default Ingredients;
