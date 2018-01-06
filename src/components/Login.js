import React, { Component } from "react";
import { Link } from "react-router-dom";

class Login extends Component {
  render() {
    return (
      <div className="pt-control-group pt-vertical" style={{ width: "300px" }}>
        <div className="pt-input-group pt-large">
          <span className="pt-icon pt-icon-person" />
          <input type="text" className="pt-input" placeholder="Username" />
        </div>
        <div className="pt-input-group pt-large">
          <span className="pt-icon pt-icon-lock" />
          <input type="password" className="pt-input" placeholder="Password" />
        </div>
        <button className="pt-button pt-large pt-intent-primary">
          <Link to="/admin">Login</Link>
        </button>
      </div>
    );
  }
}
export default Login;
