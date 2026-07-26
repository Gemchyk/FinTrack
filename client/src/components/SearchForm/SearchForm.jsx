import React, { useCallback } from 'react';
import { useState } from 'react';
import './SearchForm.scss'
import { useDispatch } from 'react-redux';
import { searchCategories } from '../Categories/categoriesSlice';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';

const SearchForm = () => {

    const dispatch = useDispatch();

    const [inputValue, setInputValue] = useState("");
    const {t} = useTranslation();

    const handleClear = () => {
        setInputValue("");
        dispatch(searchCategories(""))
    }

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputValue(e.target.value);
        deboncedSearch(newValue);
    }

    const deboncedSearch = useCallback(
        debounce(value => {
            dispatch(searchCategories(value));
            console.log("Debounces");
        }, 200), 
        []
    )

    return (
        <>
       <div className='searchInput'>
        <input
            name="search"
            type="text"
            value={inputValue}
            onChange={e => handleChange(e)}
            placeholder={t("Search")}
        />
        <button onClick={handleClear}>{t("Clear")}</button>
        </div>
            
        </>
    );
};

export default SearchForm;