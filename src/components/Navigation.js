import React, { Component } from "react";
import { Tooltip, Position } from "@blueprintjs/core";
import { Link } from "react-router-dom";

class Navigation extends Component {
  render() {
    return (
      <nav className="pt-navbar pt-dark">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading">JYPS Ry Tapahtumat</div>
          <Tooltip content="Lisää uusi tapahtuma" position={Position.RIGHT}>
            <button className="pt-button pt-minimal pt-icon-add" />
          </Tooltip>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <span className="pt-navbar-divider" />
          <Tooltip content="Asetukset" position={Position.LEFT}>
            <button className="pt-button pt-minimal pt-icon-settings" />
          </Tooltip>
          <Tooltip content="Käyttäjätiedot" position={Position.LEFT}>
            <button className="pt-button pt-minimal pt-icon-user" />
          </Tooltip>
          <Tooltip content="Kirjaudu ulos" position={Position.LEFT}>
            <Link to="/login">
              <button className="pt-button pt-minimal pt-icon-log-out" />
            </Link>
          </Tooltip>
        </div>
      </nav>
    );
  }
}

export default Navigation;
