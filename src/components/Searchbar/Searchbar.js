import React, { useState } from 'react';
import PropTypes from 'prop-types';
import css from './Searchbar.module.css';
import { ImSearch } from 'react-icons/im';

export default function Searchbar(props) { 
  const [query, setQuery] = useState('');

  const handleSearchChange = e => {
    setQuery(e.currentTarget.value.toLowerCase());
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (query.trim() === '') {
      props.onError(); 
      return;
    }
    props.onSubmit(query); 
  };

  return (
    <div className={css.searchbarHeader}>
      <form className={css.searchForm} onSubmit={handleSubmit}>
        <button className={css.searchFormButton} type="submit">
          <ImSearch className={css.icon} />
        </button>
        <input
          className={css.searchFormInput}
          value={query}
          onChange={handleSearchChange}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </div>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};







