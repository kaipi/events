import React, { Component } from "react";
import { Button, Card, Elevation, Switch } from "@blueprintjs/core";

class EventInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventdata: {
        firstname: "",
        lastname: "",
        streetaddress: "",
        zip: "",
        telephone: "",
        email: "",
        club: "",
        allowDisplay: false
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    let e = Object.assign({}, this.state.eventdata);
    e[evt.target.id] = evt.target.value;
    this.setState({ eventdata: e });
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
          <input
            className="pt-input .modifier"
            type="text"
            placeholder="Etunimi"
            dir="auto"
            id="firstname"
            value={this.state.eventdata.firstname}
            onChange={this.handleChange}
          />
          <input
            className="pt-input .modifier"
            type="text"
            placeholder="Sukunimi"
            dir="auto"
            id="lastname"
            onChange={this.handleChange}
          />
          <input
            className="pt-input .modifier"
            type="text"
            placeholder="Katuosoite"
            dir="auto"
            id="streetaddress"
            onChange={this.handleChange}
          />
        </p>
        <p>
          <input
            className="pt-input .modifier"
            type="text"
            placeholder="Postinumero"
            dir="auto"
            id="zip"
            onChange={this.handleChange}
          />
          <input
            className="pt-input .modifier"
            type="text"
            placeholder="Puhelinnumero"
            dir="auto"
            id="telephone"
            onChange={this.handleChange}
          />
          <input
            className="pt-input .modifier"
            type="text"
            placeholder="Sähköposti"
            dir="auto"
            id="email"
            onChange={this.handleChange}
          />
        </p>
        <p>
          <input
            className="pt-input .modifier"
            type="text"
            placeholder="Seura"
            dir="auto"
            id="club"
            onChange={this.handleChange}
          />
        </p>
        <p>
          <Switch
            checked={this.state.isPublic}
            id="allowDisplay"
            label="Tapahtuman järjestäjät saavat julkaista tietojani sekä kisan aikana tuotettua materiaalia nettisivuilla"
            onChange={this.handleChange}
          />
        </p>

        <div className="pt-select">
          <select defaultValue="1" onChange={this.handleChange}>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
            <option value="4">Four</option>
          </select>
        </div>
        <div className="pt-select">
          <select defaultValue="2" onChange={this.handleChange}>
            <option value="1">Liikuntasetelit</option>
            <option value="2">Verkkomaksu</option>
            <option value="3">Käteinen</option>
          </select>
        </div>
        <div className="event-enroll-button">
          <Button>Ilmoittaudu</Button>
        </div>
      </Card>
    );
    return result;
  }
}
export default EventInfo;
