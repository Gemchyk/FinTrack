import React from 'react';
import { useState } from 'react';
import './SearchForm.scss'
import { useDispatch } from 'react-redux';
import { searchCategories } from '../Categories/categoriesSlice';
import { useTranslation } from 'react-i18next';

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
        dispatch(searchCategories(newValue));
    }

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