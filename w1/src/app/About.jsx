import React, { Component } from 'react';
import PropTypes from 'prop-types';
import jquery from 'jquery';

class About extends Component {
  componentDidMount() {
    setTimeout(() => jquery('#kikoo').html('Hey, I am an old school Kikoo script'), 3000);
  }

  render() {
    return (
      <div>
        <h1>About</h1>
        <p>I'm a page with jQuery and it's shame, I assume it.</p>
        <div id="kikoo"></div>
      </div>
    );  }
}

export default About;
