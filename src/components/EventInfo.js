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
        name: "",
        groups: []
      },
      participantdata: {
        firstname: "",
        lastname: "",
        streetaddress: "",
        telephone: "",
        email: "",
        club: "",
        groupid: 0,
        paymentmethod: 1,
        public: true,
        zip:""
      },
      select_groups: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.getEventData = this.getEventData.bind(this);
    this.addParticipant = this.addParticipant.bind(this);
    this.getGroups = this.getGroups.bind(this);
  }
  componentDidMount() {
    this.getEventData(this.props.id);
  }
  getEventData(id) {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/data/v1/events/" + id, {
      method: "GET"
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        this.setState({ eventdata: response });
        this.getGroups();
        let p = Object.assign({}, this.state.participantdata);
        p.groupid = this.state.eventdata.groups[0].id;
        this.setState({ participantdata: p });
      });
  }
  addParticipant() {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/data/v1/events/addparticipant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.participantdata)
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        //response ok => direct to payment OR participant 
        if(response.errorCode !== undefined) {
          console.warn(response);
        } else {
          window.location = response.url;
        }
      })
      .catch(error => {
        console.warn(error);
      });
  }
  handleChange(evt) {
    let e = Object.assign({}, this.state.participantdata);
    if (evt.target.id === "public") {
      e[evt.target.id] = !this.state.participantdata.public;
      this.setState({ participantdata: e });
    } else {
      e[evt.target.id] = evt.target.value;
      this.setState({ participantdata: e });
    }
  }
  getGroups() {
    let g = [];
    this.state.eventdata.groups.forEach(group => {
      g.push(
        <option key={group.id} value={group.id}>
          {group.name}
        </option>
      );
    });
    this.setState({
      select_groups: (
        <select id="groupid" defaultValue="2" onChange={this.handleChange}>
          {g}
        </select>
      )
    });
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
            value={this.state.participantdata.public}
            id="public"
            label="Tapahtuman järjestäjät saavat julkaista tietojani sekä kisan aikana tuotettua materiaalia nettisivuilla"
            onChange={this.handleChange}
          />
        </p>

        <div>{this.state.select_groups}</div>
        <div>
          <select id="paymentmethod" defaultValue={1} onChange={this.handleChange}>
            <option value={1}>Verkkomaksu</option>
            <option value={2}>Liikuntasetelit</option>
            <option value={3}>Käteinen</option>
          </select>
        </div>
        <div className="event-enroll-total">
          <h5>Maksun yhteenveto</h5>
          <pre>
            Sarja: {this.state.participantdata.groupid} <br />
            Hintasi: <br />
            Maksutapa: {this.state.participantdata.paymentmethod}
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
