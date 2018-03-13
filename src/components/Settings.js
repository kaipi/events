import React, { Component } from "react";
import { Button, Card, Elevation } from "@blueprintjs/core";
import Navigation from "./Navigation";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventdata: {}
    };
  }

  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation loggedIn={this.state.loggedin} addEvent={this.addEvent} />
        </div>
        <div className="event-content">
          <Card interactive={false} elevation={Elevation.TWO}>
            <h5>Paytrail kauppiastunnus</h5>
            <p>
              {" "}
              <input className="pt-input .modifier" type="text" placeholder="Paytrailin kauppiastunnus" dir="auto" />
            </p>
            <h5>Paytrail kauppiasavain</h5>
            <p>
              {" "}
              <input className="pt-input .modifier" type="text" placeholder="Paytrailin kauppiasavain" dir="auto" />
            </p>
            <h5>Sähköpostin lähettäjä</h5>
            <p>
              {" "}
              <input className="pt-input .modifier" type="text" placeholder="Sähköpostin lähettäjä" dir="auto" />
            </p>
            <Button>Tallenna asetukset</Button>
          </Card>
        </div>
      </div>
    );
    return result;
  }
}
export default Settings;
