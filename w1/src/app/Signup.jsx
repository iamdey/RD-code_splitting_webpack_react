import React, { Component } from 'react';
import PropTypes from 'prop-types';
import zxcvbn from 'zxcvbn';

class Signup extends Component {
  static propTypes = {
  };
  static defaultProps = {
  };
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      password: '',
      passwordStrength: '',
    };
  }

  handleChange(ev) {
    const password = ev.target.value;
    const passwordStrength = zxcvbn(password).score;
    this.setState({
      password,
      passwordStrength,
    });
  }

  render() {
    return (
      <div>
        <h1>Signup</h1>
        <form method="post">
          <label>
            <div>Password</div>
            <div>
              <input type="text" onChange={this.handleChange} value={this.state.password} />
            </div>
            <div>Password strength: {this.state.passwordStrength}</div>
          </label>
        </form>
      </div>

    );
  }
}

export default Signup;
