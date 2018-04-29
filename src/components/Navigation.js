import React, { Component } from "react";
import { Button } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import { checkJwtToken } from "../utils/auth";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false
    };
    this.logout = this.logout.bind(this);
  }
  componentDidMount() {
    this.setState({ loggedin: checkJwtToken(localStorage.getItem("jyps-jwt")) });
  }
  logout() {
    localStorage.removeItem("jyps-jwt");
    this.setState({ loggedin: false });
  }
  render() {
    let addButton = "";
    let loginButton = "";
    let settingsButton = "";
    let userSettingsButton = "";

    if (this.state.loggedin) {
      addButton = (
        <Link to="/newevent">
          <Button className="app-toolbar-icon" icon="add" />
        </Link>
      );
      loginButton = <Button className="app-toolbar-icon" icon="log-out" onClick={this.logout} />;
      settingsButton = (
        <Link to="/settings">
          <Button className="app-toolbar-icon" icon="settings" onClick={this.props.settings} />
        </Link>
      );
      userSettingsButton = (
        <Link to="/users">
          <Button className="app-toolbar-icon" icon="user" />
        </Link>
      );
    } else {
      loginButton = (
        <Link to="/login">
          <Button className="app-toolbar-icon" icon="log-in" />
        </Link>
      );
    }
    return (
      <nav className="pt-navbar pt-dark">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading">
            <Link to="/">JYPS ry:n tapahtumat</Link>
          </div>
          {addButton}
        </div>
        <div className="pt-navbar-group pt-align-right">
          <span className="pt-navbar-divider" />
          {settingsButton}
          {userSettingsButton}
          {loginButton}
        </div>
      </nav>
    );
  }
}

export default Navigation;
