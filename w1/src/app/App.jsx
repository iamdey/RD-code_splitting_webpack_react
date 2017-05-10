import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Home from './Home';
import About from './About';
import Signup from './Signup';

const App = ({}) => {
  return (
    <Router>
      <Route exact="/" component={Home} />
      <Route exact="/about" component={About} />
      <Route exact="/signup" component={Signup} />
    </Router>
  );
};

App.propTypes = {
};
App.defaultProps = {
};

export default App;
