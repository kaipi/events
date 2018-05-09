import React, { Component } from "react";
import { Button, Card, Elevation, Switch, Radio, RadioGroup } from "@blueprintjs/core";
import qs from "query-string";
import { withRouter } from "react-router";
import Navigation from "./Navigation";

class EventPos extends Component {
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
        groupid: 1,
        paymentmethod: "1",
        public: true,
        zip: "",
        city: "",
        sport_voucher:false,
        sport_voucher_name:""
      },
      pos_registration: false,
      submitAllowed: false,
      paymentdata: { name: "", paymentMethodName: "", price: 0 },
      price: "",
      racenumber: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.getEventData = this.getEventData.bind(this);
    this.addParticipant = this.addParticipant.bind(this);
    this.getGroups = this.getGroups.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.getDefaultValues = this.getDefaultValues.bind(this);
  }
  componentDidMount() {
    this.getEventData(this.props.id);
    const query = qs.parse(this.props.location.search);
    if (query.payment_confirmed !== undefined) {
      if (query.payment_confirmed === "true") {
        this.setState({ registration: true });
      }
    }
  }
  getDefaultValues(data) {
    let d = { name: data.groups[0].name, paymentMethodName: "", price: data.groups[0].price_prepay };
    return d;
  }
  getEventData() {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/event/" + this.props.match.params.id, {
      method: "GET"
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        this.setState({ eventdata: response });
        let p = Object.assign({}, this.state.participantdata);
        p.groupid = this.state.eventdata.groups[0].id.toString();
        this.setState({ participantdata: p, paymentdata: this.getDefaultValues(this.state.eventdata) });
      });
  }
  addParticipant() {
    let resetdata = {
      firstname: "",
      lastname: "",
      streetaddress: "",
      telephone: "",
      email: "",
      club: "",
      groupid: 1,
      paymentmethod: 2,
      public: true,
      zip: "",
      city: "",
      sport_voucher:false,
      sport_voucher_name:""

    };
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/addparticipant_pos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jyps-jwt")
      },
      body: JSON.stringify(this.state.participantdata)
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        if (response.type === "normal") {
          this.setState({
            pos_registration: true,
            racenumber: response.racenumber,
            price: response.price,
            participantdata:resetdata,
            submitAllowed:false
          });
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
      this.validateFields(e);
    } else if(evt.target.id === "sport_voucher") {
      e[evt.target.id] = !this.state.participantdata.sport_voucher;      
      this.setState({ participantdata: e });
    }
    else {
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
          data.paymentMethodName = "Liikuntasetelit (smartum, epassi...) tai käteinen paikanpäällä";
          data.price = result.price;
        }
        this.setState({ paymentdata: data });
      }
      this.setState({ participantdata: e });
      this.validateFields(e);
    }
  }
  validateFields(data) {
    //worlds worst form validator :D
    let error = false;
    if  (data.firstname === "" || data.lastname === "" ) 
    {
      error = true;
    }
    if (error === false) {
      this.setState({ submitAllowed: true });
    } else {
      this.setState({ submitAllowed: false });
    }
  }
  getGroups() {
    let g = [];
    this.state.eventdata.groups.forEach(group => {
      g.push(
        <Radio
          key={group.id}
          label={group.name + ", Matka: " + group.distance + "km, Hinta: " + group.price + " euroa"}
          id="groupid"
          value={group.id.toString()}
        />
      );
    });

    return g;
  }

  render() {
    let validationMessage = "";
    if (this.state.submitAllowed === false) {
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
          Lomake ok, voit lisätä kilpailijan!
        </div>
      );
    }
    let posConfirm = "";
    if (this.state.pos_registration === true) {
      posConfirm = (
        <div className="pt-callout pt-intent-success">
          <h4 className="pt-callout-title">Kilpailija lisätty!</h4>
          Anna kilpailunumero: <b>{this.state.racenumber}</b>
          <br />
          Maksu: <b>{this.state.price} euroa</b>
        </div>
      );
    }
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation addEvent={this.addEvent} />
        </div>
        <div className="event-content">
          <Card interactive={false} elevation={Elevation.TWO}>
            {posConfirm}
            <h5>Tapahtuman nimi</h5>
            <p>{this.state.eventdata.name}</p>
            <div>
              <h5>Henkilötiedot</h5>
              <div className="input-w">
                <label htmlFor="firstname">Etunimi *</label>
                <input
                  className="pt-input .modifier"
                  type="text"
                  dir="auto"
                  id="firstname"
                  size="30"
                  value={this.state.participantdata.firstname}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-w">
                <label htmlFor="lastname">Sukunimi *</label>
                <input
                  size="30"
                  className="pt-input .modifier"
                  type="text"
                  dir="auto"
                  id="lastname"
                  value={this.state.participantdata.lastname}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-w">
                <label htmlFor="streetaddress">Katuosoite</label>
                <input
                  className="pt-input .modifier"
                  type="text"
                  size="40"
                  dir="auto"
                  id="streetaddress"
                  value={this.state.participantdata.streetaddress}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-w">
                <label htmlFor="zip">Postinumero</label>
                <input
                  size="5"
                  className="pt-input .modifier"
                  type="text"
                  dir="auto"
                  id="zip"
                  value={this.state.participantdata.zip}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-w">
                <label htmlFor="city">Kaupunki</label>
                <input
                  size="30"
                  className="pt-input .modifier"
                  type="text"
                  dir="auto"
                  id="city"
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-w">
                <label htmlFor="telephone">Puhelin:</label>
                <input
                  className="pt-input .modifier"
                  type="text"
                  dir="auto"
                  size="30"
                  id="telephone"
                  value={this.state.participantdata.telephone}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-w">
                <label htmlFor="email">Sähköposti</label>
                <input
                  size="30"
                  className="pt-input .modifier"
                  type="text"
                  dir="auto"
                  id="email"
                  value={this.state.participantdata.email}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-w">
                <label htmlFor="club">Seura:</label>
                <input
                  size="30"
                  className="pt-input .modifier"
                  type="text"
                  dir="auto"
                  id="club"
                  value={this.state.participantdata.club}
                  onChange={this.handleChange}
                />
              </div>
              <p>
                <Switch
                  checked={this.state.participantdata.public}
                  value={this.state.participantdata.public}
                  id="public"
                  label="Tapahtuman järjestäjät saavat julkaista tietojani (tulokset/osallistujat), sekä kisan aikana tuotettua materiaalia nettisivuilla (kuvat, videot tmv.)"
                  onChange={this.handleChange}
                />
              </p>
              <Switch
                checked={this.state.participantdata.sport_voucher}
                value={this.state.participantdata.sport_voucher}
                id="sport_voucher"
                label="Maksu liikuntaseteleillä"
                onChange={this.handleChange}
              />
              <label htmlFor="club">Liikuntasetelin nimi:</label>
              <input
                size="30"
                className="pt-input .modifier"
                type="text"
                dir="auto"
                id="sport_voucher_name"
                value={this.state.participantdata.sport_voucher_name}
                onChange={this.handleChange}
              />
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
                <Button onClick={this.addParticipant} disabled={!this.state.submitAllowed}>
                  Lisää kilpailija
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
    return result;
  }
}
export default withRouter(EventPos);
