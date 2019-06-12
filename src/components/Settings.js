import React, { Component } from "react";
import { Card, Elevation, Button } from "@blueprintjs/core";
import Navigation from "./Navigation";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: [],
      newSettings: { key: "", value: "" },
      loggedin: false,
      settingsrows: []
    };
    this.getSettingRows = this.getSettingRows.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
    this.deleteSettings = this.deleteSettings.bind(this);
    this.addSettings = this.addSettings.bind(this);
    this.updateSetting = this.updateSetting.bind(this);
    this.updateExistingSetting = this.updateExistingSetting.bind(this);
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
          <td>
            {" "}
            <input
              className="bp3-input"
              id={item.id}
              type="text"
              size="45"
              value={item.value}
              placeholder="Asetus"
              dir="auto"
              onChange={this.updateExistingSetting}
            />
          </td>
          <td>
            <Button
              className="app-icon-button"
              rightIcon="trash"
              onClick={() => {
                this.deleteSettings(item.id);
              }}
            />
            <Button
              className="app-icon-button"
              rightIcon="floppy-disk"
              onClick={() => {
                this.updateSettings(item.id, item.value);
              }}
            />
          </td>
        </tr>
      );
    });
    this.setState({ settingsrows: settings });
  }
  updateSettings(id, value) {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/settings/update", {
      method: "POST",
      body: JSON.stringify({ id: id, value: value }),
      headers: { Authorization: "Bearer " + localStorage.getItem("jyps-jwt") }
    })
      .then(response => {
        return response.json();
      })
      .then(r => {
        this.getSettingRows();
      })
      .catch(error => {
        console.warn(error);
      });
  }
  updateExistingSetting(evt) {
    // let set = this.state.settings;
    //let res = set.find(arr => arr.id === evt.target.id);
    //set[set.indexOf(res)][evt.target.id] = evt.target.value;
    //this.setState({ settings: set });
  }
  addSettings() {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/settings/add", {
      method: "POST",
      body: JSON.stringify(this.state.newSettings),
      headers: { Authorization: "Bearer " + localStorage.getItem("jyps-jwt"), "Content-Type": "application/json" }
    })
      .then(response => {
        return response;
      })
      .then(r => {
        this.getSettingRows();
      })
      .catch(error => {
        console.warn(error);
      });
  }
  deleteSettings(id) {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/settings/delete/" + id, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + localStorage.getItem("jyps-jwt") }
    })
      .then(response => {
        return response.json();
      })
      .then(r => {
        this.getSettingRows();
      })
      .catch(error => {
        console.warn(error);
      });
  }
  updateSetting(evt) {
    let set = Object.assign({}, this.state.newSettings);
    set[evt.target.id] = evt.target.value;
    this.setState({ newSettings: set });
  }
  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation loggedin={this.state.loggedin} addEvent={this.addEvent} />
        </div>
        <div className="event-content">
          <Card interactive={false} elevation={Elevation.TWO}>
            <table className="bp3-html-table pt-interactive event-table">
              <thead>
                <tr>
                  <th>Asetus</th>
                  <th>Arvo</th>
                  <th>Toiminto</th>
                </tr>
              </thead>
              <tbody>
                {this.state.settingsrows}
                <tr>
                  <td>
                    {" "}
                    <input
                      className="bp3-input"
                      id="key"
                      type="text"
                      value={this.state.newSettings.key}
                      placeholder="Asetus"
                      dir="auto"
                      onChange={this.updateSetting}
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      className="bp3-input"
                      id="value"
                      type="text"
                      value={this.state.newSettings.value}
                      placeholder="Arvo"
                      dir="auto"
                      onChange={this.updateSetting}
                    />
                  </td>
                  <td>
                    <Button
                      className="app-icon-button"
                      rightIcon="add"
                      onClick={() => {
                        this.addSettings();
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
    return result;
  }
}
export default Settings;
