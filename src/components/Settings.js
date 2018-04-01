import React, { Component } from "react";
import { Card, Elevation } from "@blueprintjs/core";
import Navigation from "./Navigation";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: [],
      loggedin: false,
      settingsrows: []
    };
    this.getSettingRows = this.getSettingRows.bind(this);
  }
  componentDidMount() {
    let loginboolean = false;
    if (localStorage.getItem("loggedin") === "true") {
      loginboolean = true;
    }
    this.setState({ loggedin: loginboolean });
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/settings", {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorage.getItem("jyps-jwt") }
    })
      .then(response => {
        return response.json();
      })
      .then(r => {
        this.setState({ settings: r });
        this.getSettingRows();
      })
      .catch(error => {
        console.warn(error);
      });
  }
  getSettingRows() {
    let settings = [];
    this.state.settings.forEach(item => {
      settings.push(
        <tr key={item.id}>
          <td>{item.key}</td>
          <td>{item.value}</td>
        </tr>
      );
    });
    this.setState({ settingsrows: settings });
  }
  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation loggedin={this.state.loggedin} addEvent={this.addEvent} />
        </div>
        <div className="event-content">
          <Card interactive={false} elevation={Elevation.TWO}>
            <table className="pt-html-table pt-interactive event-table">
              <thead>
                <tr>
                  <th>Asetus</th>
                  <th>Arvo</th>
                  <th />
                </tr>
              </thead>
              <tbody>{this.state.settingsrows}</tbody>
            </table>
          </Card>
        </div>
      </div>
    );
    return result;
  }
}
export default Settings;
