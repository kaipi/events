import React, { Component } from "react";
import { Button, Card, Elevation, Switch, Radio, RadioGroup } from "@blueprintjs/core";
import qs from "query-string";
import { withRouter } from "react-router";

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
        groups: [],
        close_date: ""
      },
      participantdata: {
        firstname: "",
        lastname: "",
        streetaddress: "",
        telephone: "",
        email: "",
        club: "",
        groupid: "1",
        paymentmethod: "1",
        public: true,
        zip: "",
        city: "",
        jyps_member: false,
        team: "",
        birth_year: ""
      },
      registration: false,
      submitAllowed: true,
      paymentdata: {
        name: "",
        paymentMethodName: "",
        price: 0,
        discount: 5,
        id: 0
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.getEventData = this.getEventData.bind(this);
    this.addParticipant = this.addParticipant.bind(this);
    this.getGroups = this.getGroups.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.getDefaultValues = this.getDefaultValues.bind(this);
  }
  componentDidMount() {
    this.getEventData(this.props.id);
    const query = qs.parse(this.props.location.search);
    if (query.payment_confirmed !== undefined) {
      if (query.payment_confirmed === "true") {
        this.setState({
          registration: true
        });
      }
    }
  }
  getDefaultValues(data) {
    let d = {
      name: data.groups[0].name,
      paymentMethodName: "",
      price: data.groups[0].price_prepay,
      id: data.groups[0].id,
      discount: data.groups[0].discount
    };
    return d;
  }
  getEventData(id) {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/event/" + id, {
      method: "GET"
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        this.setState({
          eventdata: response
        });
        let p = Object.assign({}, this.state.participantdata);
        p.groupid = this.state.eventdata.groups[0].id.toString();
        this.setState({
          participantdata: p,
          paymentdata: this.getDefaultValues(this.state.eventdata)
        });
      });
  }
  addParticipant() {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/addparticipant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "FYP6vgZHnK92$$kk"
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
          this.setState({
            registration: true
          });
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
    let data = {
      id: "",
      name: "",
      paymentMethodName: "",
      price: 0,
      discount: 5
    };
    let e = Object.assign({}, this.state.participantdata);
    if (evt.target.id === "public") {
      e[evt.target.id] = !this.state.participantdata.public;
      this.setState({
        participantdata: e
      });
      this.validateFields(e);
      return;
    } else if (evt.target.id === "jyps_member") {
      e[evt.target.id] = !e.jyps_member;
      if (e.jyps_member === true) {
        let n = Object.assign({}, this.getDefaultValues(this.state.eventdata));
        n.price = n.price - n.discount;
        this.setState({
          participantdata: e,
          paymentdata: n
        });
        return;
      }
      this.setState({
        participantdata: e,
        paymentdata: this.getDefaultValues(this.state.eventdata)
      });
      this.validateFields(e);
      return;
    }
    e[evt.target.id] = evt.target.value;

    if (evt.target.id === "groupid") {
      // calc price
      let result = this.state.eventdata.groups.find(group => group.id === parseInt(evt.target.value, 10));
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
      if (this.state.participantdata.jyps_member === true) {
        data.price = result.price_prepay - data.discount;
      }
      this.setState({
        paymentdata: data
      });
    }

    this.setState({
      participantdata: e
    });
    this.validateFields(e);
    return;
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
  validateFields(data) {
    //worlds worst form validator :D
    let error = false;
    if (!this.validateEmail(data.email)) {
      error = true;
    } else if (
      data.firstname === "" ||
      data.lastname === "" ||
      data.streetaddress === "" ||
      data.zip === "" ||
      data.city === "" ||
      data.city === "" ||
      data.birth_year < 1900
    ) {
      error = true;
    }
    if (error === false) {
      this.setState({
        submitAllowed: false
      });
    } else {
      this.setState({
        submitAllowed: true
      });
    }
  }
  getGroups() {
    let g = [];
    this.state.eventdata.groups.forEach(group => {
      let p = group.price_prepay;
      if (this.state.participantdata.jyps_member === true) {
        p = group.price_prepay - this.state.paymentdata.discount;
      }
      g.push(
        <Radio
          key={group.id}
          label={group.name + ", Matka: " + group.distance + "km, Hinta: " + p + " euroa"}
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
          <h4 className="pt-callout-title"> Tarkista lomake </h4>
          Täytä lomakkeen tähdellä merkityt kentät{" "}
        </div>
      );
    } else {
      validationMessage = (
        <div className="pt-callout pt-intent-success">
          <h4 className="pt-callout-title"> Lomake kunnossa </h4>
          Voit jatkaa maksamiseen.Maksu hoidetaan verkkomaksuna Paytrail Oy: n palvelun välityksellä. <br />
          <b>
            Olet ilmoittautumassa sarjaan: {this.state.paymentdata.name}, Hinta: {this.state.paymentdata.price}
            euroa.{" "}
          </b>{" "}
        </div>
      );
    }
    let result = (
      <Card interactive={false} elevation={Elevation.TWO}>
        <h5> Tapahtuman nimi </h5> <p> {this.state.eventdata.name} </p> <h5> Tapahtuman kuvaus </h5>{" "}
        <p> {this.state.eventdata.general_description} </p> <h5> Aika ja paikka </h5>{" "}
        <p>
          {" "}
          {this.state.eventdata.date} {this.state.eventdata.location}{" "}
        </p>{" "}
        <h5> Maksutavat </h5> <p> {this.state.eventdata.payment_description} </p> <h5> Sarjat ja matkat </h5>{" "}
        <p> {this.state.eventdata.groups_description} </p>{" "}
        {this.state.registration ? (
          <div className="pt-callout pt-intent-success">
            <h4 className="pt-callout-title "> Ilmoittautuminen onnistui! </h4>
            Tervetuloa mukaan, saat sähköpostiisi vielä vahvistuksen kisamaksusta ja lisäohjeita!
          </div>
        ) : (
          <div>
            <h5> Henkilötiedot </h5>{" "}
            <div className="input-w">
              <label htmlFor="firstname"> Etunimi * </label>{" "}
              <input
                className="pt-input .modifier"
                type="text"
                dir="auto"
                id="firstname"
                size="30"
                value={this.state.eventdata.firstname}
                onChange={this.handleChange}
              />{" "}
            </div>{" "}
            <div className="input-w">
              <label htmlFor="lastname"> Sukunimi * </label>{" "}
              <input
                size="30"
                className="pt-input .modifier"
                type="text"
                dir="auto"
                id="lastname"
                onChange={this.handleChange}
              />{" "}
            </div>{" "}
            <div className="input-w">
              <label htmlFor="birth_year"> Syntymävuosi * </label>{" "}
              <input
                size="4"
                className="pt-input .modifier"
                type="text"
                dir="auto"
                id="birth_year"
                onChange={this.handleChange}
              />{" "}
            </div>{" "}
            <div className="input-w">
              <label htmlFor="streetaddress"> Katuosoite * </label>{" "}
              <input
                className="pt-input .modifier"
                type="text"
                size="40"
                dir="auto"
                id="streetaddress"
                onChange={this.handleChange}
              />{" "}
            </div>{" "}
            <div className="input-w">
              <label htmlFor="zip"> Postinumero * </label>{" "}
              <input
                size="5"
                className="pt-input .modifier"
                type="text"
                dir="auto"
                id="zip"
                onChange={this.handleChange}
              />{" "}
            </div>{" "}
            <div className="input-w">
              <label htmlFor="city"> Kaupunki * </label>{" "}
              <input
                size="30"
                className="pt-input .modifier"
                type="text"
                dir="auto"
                id="city"
                onChange={this.handleChange}
              />{" "}
            </div>{" "}
            <div className="input-w">
              <label htmlFor="telephone"> Puhelin *: </label>{" "}
              <input
                className="pt-input .modifier"
                type="text"
                dir="auto"
                size="30"
                id="telephone"
                onChange={this.handleChange}
              />{" "}
            </div>{" "}
            <div className="input-w">
              <label htmlFor="email"> Sähköposti * </label>{" "}
              <input
                size="30"
                className="pt-input .modifier"
                type="text"
                dir="auto"
                id="email"
                onChange={this.handleChange}
              />{" "}
            </div>{" "}
            <div className="input-w">
              <label htmlFor="club"> Seura tai kotikunta: </label>{" "}
              <input
                size="30"
                className="pt-input .modifier"
                type="text"
                dir="auto"
                id="club"
                onChange={this.handleChange}
              />{" "}
            </div>{" "}
            <div className="input-w">
              <label htmlFor="team"> Joukkue: </label>{" "}
              <input
                size="30"
                className="pt-input .modifier"
                type="text"
                dir="auto"
                id="team"
                onChange={this.handleChange}
              />{" "}
            </div>{" "}
            <p>
              <Switch
                checked={this.state.participantdata.public}
                value={this.state.participantdata.public}
                id="public"
                label="Tapahtuman järjestäjät saavat julkaista tietojani (Osallistuja- ja tuloslistat) sekä kisan aikana tuotettua materiaalia nettisivuilla (kuvat, videot tmv.)"
                onChange={this.handleChange}
              />{" "}
              <Switch
                checked={this.state.participantdata.jyps_member}
                value={this.state.participantdata.jyps_member}
                id="jyps_member"
                label="JYPS Ry jäsen, erikoishinta"
                onChange={this.handleChange}
              />{" "}
            </p>
            <div>
              <h5> Sarjat </h5>{" "}
              <RadioGroup
                id="groupid"
                onChange={this.handleChange}
                selectedValue={this.state.participantdata.groupid}
                value={this.state.participantdata.groupid}
              >
                {" "}
                {this.getGroups()}{" "}
              </RadioGroup>{" "}
            </div>{" "}
            {validationMessage}{" "}
            {this.state.eventdata.close_date < Date.now ? (
              <div className="event-enroll-button">
                <Button onClick={this.addParticipant} disabled={this.state.submitAllowed}>
                  Ilmoittaudu ja maksa{" "}
                </Button>{" "}
              </div>
            ) : (
              <div className="event-enroll-button">
                <Button>Ilmoittautuminen on päättynyt </Button>
              </div>
            )}{" "}
          </div>
        )}{" "}
      </Card>
    );
    return result;
  }
}
export default withRouter(EventInfo);
