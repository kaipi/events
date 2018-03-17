import React, { Component } from "react";
import { Button, Card, Elevation, Switch } from "@blueprintjs/core";

class EventInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventdata: {
        groups_description: "",
        payment_description: "",
        id: "",
        location: "",
        general_description: "",
        name: ""
      },
      participantdata: {
        firstname: "",
        lastname: "",
        streetaddress: "",
        zipcode: "",
        telephone: "",
        email: "",
        club: "",
        groupid: "",
        paymentmethod: "1",
        public: true
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.getEventData = this.getEventData.bind(this);
    this.addParticipant = this.addParticipant.bind(this);
  }
  componentWillMount() {
    this.getEventData(this.props.id);
  }
  getEventData(id) {
    fetch("http://localhost:5000/api/data/v1/events/" + id, {
      method: "GET"
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        this.setState({ eventdata: response });
      });
  }
  addParticipant() {
    console.log(this.state.participantdata);

    fetch("http://localhost:5000/api/data/v1/events/addparticipant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.participantdata)
    })
      .then(response => {
        return response.json();
      })
      .then(response => {})
      .catch(error => {
        console.log(error);
      });
  }
  handleChange(evt) {
    let e = Object.assign({}, this.state.participantdata);
    e[evt.target.id] = evt.target.value;
    this.setState({ participantdata: e });
  }
  render() {
    let result = (
      <Card interactive={false} elevation={Elevation.TWO}>
        <h5>Tapahtuman nimi</h5>
        <p>{this.state.eventdata.name}</p>
        <h5>Tapahtuman kuvaus</h5>
        <p>{this.state.eventdata.general_description}</p>
        <h5>Aika ja paikka</h5>
        <p>
          {this.state.eventdata.date} {this.state.eventdata.location}
        </p>
        <h5>Maksutavat</h5>
        <p>{this.state.eventdata.payment_description}</p>
        <h5>Sarjat ja matkat</h5>
        <p>{this.state.eventdata.groups_description}</p>
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
            checked={this.state.participantdata.public}
            id="public"
            label="Tapahtuman järjestäjät saavat julkaista tietojani sekä kisan aikana tuotettua materiaalia nettisivuilla"
            onChange={this.handleChange}
          />
        </p>

        <div className="pt-select">
          <select id="groupid" defaultValue="1" onChange={this.handleChange}>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
            <option value="4">Four</option>
          </select>
        </div>
        <div className="pt-select">
          <select id="paymentmethod" defaultValue="2" onChange={this.handleChange}>
            <option value="1">Liikuntasetelit</option>
            <option value="2">Verkkomaksu</option>
            <option value="3">Käteinen</option>
          </select>
        </div>
        <div className="event-enroll-total">
          <h5>Maksun yhteenveto</h5>
          <pre>
            Sarja: Naiset Yleinen <br />
            Hintasi: 20e <br />
            Maksutapa: Liikuntasetelit paikanpäällä
          </pre>
        </div>
        <div className="event-enroll-button">
          <Button onClick={this.addParticipant}>Ilmoittaudu</Button>
        </div>
      </Card>
    );
    return result;
  }
}
export default EventInfo;
