import React, { Component } from "react";
import { Button, Card, Elevation } from "@blueprintjs/core";
import Navigation from "./Navigation";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {},
      loggedin: false
    };
  }
  componentDidMount() {
    let loginboolean = false;
    if (localStorage.getItem("loggedin") === "true") {
      loginboolean = true;
    }
    this.setState({ loggedin: loginboolean });
  }
  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation loggedin={this.state.loggedin} addEvent={this.addEvent} />
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
            <h5>API avain</h5> <pre>APIKEY</pre>
            <Button>Tallenna asetukset</Button>
          </Card>
        </div>
      </div>
    );
    return result;
  }
}
export default Settings;
