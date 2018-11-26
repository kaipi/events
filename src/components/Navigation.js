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
      <nav className="bp3-navbar bp3-dark">
        <div className="bp3-navbar-group bp3-align-left">
          <div className="bp3-navbar-heading">
            <Link to="/">JYPSin tapahtumat</Link>
          </div>
          {addButton}
        </div>
        <div className="bp3-navbar-group bp3-align-right">
          <span className="bp3-navbar-divider" />
          {settingsButton}
          {userSettingsButton}
          {loginButton}
        </div>
      </nav>
    );
  }
}

export default Navigation;
