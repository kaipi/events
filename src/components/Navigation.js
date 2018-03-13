import React, { Component } from "react";
import { Button } from "@blueprintjs/core";
import { Link } from "react-router-dom";

class Navigation extends Component {
  render() {
    return (
      <nav className="pt-navbar pt-dark">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading">
            <Link to="/">JYPS Ry Tapahtumat</Link>
          </div>
          <Link to="/newevent">
            <Button className="app-toolbar-icon" icon="add" />
          </Link>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <span className="pt-navbar-divider" />
          <Link to="/settings">
            <Button className="app-toolbar-icon" icon="settings" />
          </Link>
          <Button className="app-toolbar-icon" icon="user" />
          <Button className="app-toolbar-icon" icon="log-in" />
        </div>
      </nav>
    );
  }
}

export default Navigation;
