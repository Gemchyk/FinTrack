import React, { useEffect, useMemo } from 'react';
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
        // Otherwise a search typed just before Clear fires afterwards and re-filters the list
        deboncedSearch.cancel();
        setInputValue("");
        dispatch(searchCategories(""))
    }

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputValue(e.target.value);
        deboncedSearch(newValue);
    }

    // useMemo with real deps: the linter checks them, unlike a debounce passed to useCallback
    const deboncedSearch = useMemo(
        () => debounce(value => {
            dispatch(searchCategories(value));
        }, 200),
        [dispatch]
    )

    useEffect(() => () => deboncedSearch.cancel(), [deboncedSearch]);

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