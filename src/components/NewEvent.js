import React, { Component } from "react";
import { Button, Card, Elevation } from "@blueprintjs/core";
import Navigation from "./Navigation";
import Group from "./Group";
class NewEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventdata: {},
      groups: []
    };
    this.addGroup = this.addGroup.bind(this);
  }

  addGroup() {
    let g = this.state.groups;
    g.push(<Group key={g.length} />);
    this.setState({ groups: g });
  }
  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation loggedIn={this.state.loggedin} addEvent={this.addEvent} />
        </div>
        <div className="event-content">
          <Card interactive={false} elevation={Elevation.TWO}>
            <h5>Tapahtuman kuvaus</h5>
            <p>
              {" "}
              <input className="pt-input .modifier" type="textarea" placeholder="Kuvaus" dir="auto" />
            </p>
            <h5>Aika ja paikka</h5>
            <p>
              {" "}
              <input className="pt-input .modifier" type="text" placeholder="Aika ja paikka" dir="auto" />
            </p>
            <h5>Maksutavat</h5>
            <p>
              {" "}
              <input className="pt-input .modifier" type="text" placeholder="Kuvaus maksutavoista" dir="auto" />
            </p>
            <h5>Sarjat ja matkat</h5>
            <p>
              {" "}
              <input className="pt-input .modifier" type="text" placeholder="Kuvaus sarjoista" dir="auto" />
            </p>
            <Button className="app-icon-button" onClick={this.addGroup} icon="edit" />
            <Button>Luo tapahtuma</Button>
            {this.state.groups}
          </Card>
        </div>
      </div>
    );
    return result;
  }
}
export default NewEvent;
