import React, { Component } from "react";
import { Button } from "@blueprintjs/core";

class Navigation extends Component {
  render() {
    return (
      <nav className="pt-navbar pt-dark">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading">JYPS Ry Tapahtumat</div>
          <Button className="app-toolbar-icon" icon="add" onClick={this.props.addEvent} />
        </div>
        <div className="pt-navbar-group pt-align-right">
          <span className="pt-navbar-divider" />
          <Button className="app-toolbar-icon" icon="settings" />
          <Button className="app-toolbar-icon" icon="user" />
          <Button className="app-toolbar-icon" icon="log-in" />
        </div>
      </nav>
    );
  }
}

export default Navigation;
