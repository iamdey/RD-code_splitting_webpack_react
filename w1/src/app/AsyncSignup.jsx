import React from 'react';
import PropTypes from 'prop-types';
import AsyncLoad from './AsyncLoad';

const AsyncSignup = ({}) => {
  return (
    <AsyncLoad load={import('./Signup')} loading={(
      <div>Signup is loading</div>
    )} />
  );
};

export default AsyncSignup;
