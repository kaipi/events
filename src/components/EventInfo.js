import React, { Component } from "react";
import { Button, Card, Elevation, Switch, Radio, RadioGroup } from "@blueprintjs/core";

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
        groupid: "1",
        paymentmethod: "2",
        public: true,
        zip: "",
        city: ""
      },
      registration: false,
      submitAllowed: true,
      paymentdata: { name: "", paymentMethodName: "", price: 0 }
    };
    this.handleChange = this.handleChange.bind(this);
    this.getEventData = this.getEventData.bind(this);
    this.addParticipant = this.addParticipant.bind(this);
    this.getGroups = this.getGroups.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }
  componentDidMount() {
    this.getEventData(this.props.id);
  }
  getEventData(id) {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/event/" + id, {
      method: "GET"
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        this.setState({ eventdata: response });
        let p = Object.assign({}, this.state.participantdata);
        p.groupid = this.state.eventdata.groups[0].id.toString();
        this.setState({ participantdata: p });
      });
  }
  addParticipant() {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/addparticipant", {
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
        if (response.type === "normal") {
          this.getEventData(this.props.id);
          this.setState({ registration: true });
          this.props.history.push("/");
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
      this.validateFields();
      e[evt.target.id] = evt.target.value;
      let data = { name: "", paymentMethodName: "", price: 0 };

      if (evt.target.id === "groupid") {
        let result = this.state.eventdata.groups.find(group => group.id === parseInt(evt.target.value, 10));
        // calc price
        if (this.state.participantdata.paymentmethod === "1") {
          data.name = result.name;
          data.paymentMethodName = "Paytrail verkkomaksu";
          data.price = result.price_prepay;
        } else if (this.state.participantdata.paymentmethod === "2") {
          data.name = result.name;
          data.paymentMethodName = "Liikuntasetelit (smartum, epassi...) paikanpäällä";
          data.price = result.price;
        }
        if (this.state.participantdata.paymentmethod === "3") {
          data.name = result.name;
          data.paymentMethodName = "Käteinen paikanpäällä";
          data.price = result.price;
        }
        this.setState({ paymentdata: data });
      }
      this.setState({ participantdata: e });
    }
  }
  validateEmail(mail) {
    if (mail === "") {
      return false;
    }
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }
  validateFields() {
    //worlds worst form validator :D
    let error = false;
    if (!this.validateEmail(this.state.participantdata.email)) {
      error = true;
    } else if (
      this.state.participantdata.firstname === "" ||
      this.state.participantdata.lastname === "" ||
      this.state.participantdata.streetaddress === "" ||
      this.state.participantdata.zip === "" ||
      this.state.participantdata.city === ""
    ) {
      error = true;
    }
    if (error === false) {
      this.setState({ submitAllowed: false });
    } else {
      this.setState({ submitAllowed: true });
    }
  }
  getGroups() {
    let g = [];
    this.state.eventdata.groups.forEach(group => {
      g.push(
        <Radio
          key={group.id}
          label={group.name + ", Matka: " + group.distance + ", Hinta: " + group.price_prepay + "euroa"}
          id="groupid"
          value={group.id.toString()}
        />
      );
    });

    return g;
  }

  render() {
    let validationMessage = "";
    if (this.state.submitAllowed === true) {
      validationMessage = (
        <div className="pt-callout pt-intent-warning">
          <h4 className="pt-callout-title">Tarkista lomake</h4>
          Täytä lomakkeen tähdellä merkityt kentät
        </div>
      );
    } else {
      validationMessage = (
        <div className="pt-callout pt-intent-success">
          <h4 className="pt-callout-title">Lomake kunnossa</h4>
          Voit jatkaa ilmoittautumiseen
        </div>
      );
    }
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
        {this.state.registration ? (
          <div className="pt-callout pt-intent-success">
            <h4 className="pt-callout-title ">Ilmoittautuminen onnistui!</h4>
            Tervetuloa mukaan, saat sähköpostiisi vielä vahvistuksen kisamaksusta ja lisäohjeita!
          </div>
        ) : (
          <div>
            <h5>Henkilötiedot</h5>
            <p>
              <input
                className="pt-input .modifier"
                type="text"
                placeholder="Etunimi *"
                dir="auto"
                id="firstname"
                value={this.state.eventdata.firstname}
                onChange={this.handleChange}
              />
            </p>
            <p>
              <input
                className="pt-input .modifier"
                type="text"
                placeholder="Sukunimi *"
                dir="auto"
                id="lastname"
                onChange={this.handleChange}
              />
            </p>
            <p>
              <input
                className="pt-input .modifier"
                type="text"
                placeholder="Katuosoite *"
                dir="auto"
                id="streetaddress"
                onChange={this.handleChange}
              />

              <input
                className="pt-input .modifier"
                type="text"
                placeholder="Postinumero *"
                dir="auto"
                id="zip"
                onChange={this.handleChange}
              />
              <input
                className="pt-input .modifier"
                type="text"
                placeholder="Kaupunki *"
                dir="auto"
                id="city"
                onChange={this.handleChange}
              />
            </p>
            <p>
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
                placeholder="Sähköposti *"
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
                label="Tapahtuman järjestäjät saavat julkaista tietojani (tulokset/osallistujat), sekä kisan aikana tuotettua materiaalia nettisivuilla (kuvat, videot tmv.)"
                onChange={this.handleChange}
              />
            </p>

            <div>
              <h5>Sarjat</h5>
              <RadioGroup
                id="groupid"
                onChange={this.handleChange}
                selectedValue={this.state.participantdata.groupid}
                value={this.state.participantdata.groupid}
              >
                {this.getGroups()}
              </RadioGroup>
            </div>
            {validationMessage}
            <div className="event-enroll-button">
              <Button onClick={this.addParticipant} disabled={this.state.submitAllowed}>
                Ilmoittaudu
              </Button>
            </div>
          </div>
        )}
      </Card>
    );
    return result;
  }
}
export default EventInfo;
