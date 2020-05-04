import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
    const {onLoadIngredients} = props
    const [filterStr, setFilterStr] = useState('')
    const inputRef = useRef()

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filterStr === inputRef.current.value) {
                const query = filterStr.length === 0 ? ''
                    : `?orderBy="title"&equalTo="${filterStr}"`
                fetch('https://trash-ee426.firebaseio.com/ingredients.json' + query)
                    .then((response => {
                        return response.json()
                    }))
                    .then(response => {
                        const ingredients = []
                        for (const key in response) {
                            ingredients.push({
                                ...response[key],
                                id: key
                            })
                        }
                        onLoadIngredients(ingredients)
                    })
            }
        }, 800)
        return () => {
            clearTimeout(timer)
        }
    }, [filterStr, onLoadIngredients, inputRef])

    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input type="text"
                           ref={inputRef}
                           value={filterStr}
                           onChange={event => setFilterStr(event.target.value)}/>
                </div>
            </Card>
        </section>
    );
});

export default Search;
