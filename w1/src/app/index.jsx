import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'
import Home from './Home';
import About from './About';
import AsyncSignup from './AsyncSignup';

const App = ({}) => {
  return (
    <Router>
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/signup">Signup</Link></li>
        </ul>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/signup" component={AsyncSignup} />
        </Switch>
      </div>
    </Router>
  );
};

App.propTypes = {
};
App.defaultProps = {
};

export default App;
