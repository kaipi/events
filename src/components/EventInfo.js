import React, { Component } from "react";
import { Button, Card, Elevation, Switch } from "@blueprintjs/core";

class EventInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventdata: {}
    };
  }

  render() {
    let result = (
      <Card interactive={false} elevation={Elevation.TWO}>
        <h5>Tapahtuman kuvaus</h5>
        <p>{this.state.eventdata.description}</p>
        <h5>Aika ja paikka</h5>
        <p>{this.state.eventdata.timedescription}</p>
        <h5>Maksutavat</h5>
        <p>{this.state.eventdata.paymentmethods}</p>
        <h5>Sarjat ja matkat</h5>
        <p>{this.state.eventdata.groupsdescriptions}</p>
        <h5>Ilmoittautuminen</h5>
        <p>
          <input className="pt-input .modifier" type="text" placeholder="Etunimi" dir="auto" />
          <input className="pt-input .modifier" type="text" placeholder="Sukunimi" dir="auto" />
          <input className="pt-input .modifier" type="text" placeholder="Katuosoite" dir="auto" />
        </p>
        <p>
          <input className="pt-input .modifier" type="text" placeholder="Postinumero" dir="auto" />
          <input className="pt-input .modifier" type="text" placeholder="Puhelinnumero" dir="auto" />
          <input className="pt-input .modifier" type="text" placeholder="Sähköposti" dir="auto" />
        </p>
        <p>
          <input className="pt-input .modifier" type="text" placeholder="Seura" dir="auto" />
        </p>
        <p>
          <Switch
            checked={this.state.isPublic}
            label="Tietoni saa näyttää osallistujalistalla"
            onChange={this.handlePublicChange}
          />
        </p>

        <div className="pt-select">
          <select defaultValue="1">
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
            <option value="4">Four</option>
          </select>
        </div>
        <div className="pt-select">
          <select defaultValue="2">
            <option value="1">Liikuntasetelit</option>
            <option value="2">Verkkomaksu</option>
            <option value="3">Käteinen</option>
          </select>
        </div>

        <Button>Ilmoittaudu</Button>
      </Card>
    );
    return result;
  }
}
export default EventInfo;
