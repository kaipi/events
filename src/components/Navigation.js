import React, { Component } from "react";
import { Button } from "@blueprintjs/core";
import { Link } from "react-router-dom";

class Navigation extends Component {
  render() {
    let addButton = "";
    let loginButton = "";
    let settingsButton = "";
    let userSettingsButton = "";

    if (this.props.loggedin) {
      addButton = (
        <Link to="/newevent">
          <Button className="app-toolbar-icon" icon="add" />
        </Link>
      );
      loginButton = <Button className="app-toolbar-icon" icon="log-out" onClick={this.props.logout} />;
      settingsButton = (
        <Link to="/settings">
          <Button className="app-toolbar-icon" icon="settings" onClick={this.logOut} />
        </Link>
      );
      userSettingsButton = <Button className="app-toolbar-icon" icon="user" />;
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
            <Link to="/">JYPS Ry Tapahtumat</Link>
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
