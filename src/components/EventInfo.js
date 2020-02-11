import React, { Component } from "react";
import {
  Button,
  Card,
  Elevation,
  Switch,
  Radio,
  RadioGroup,
  HTMLSelect
} from "@blueprintjs/core";
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
        close_date: "",
        event_active: false
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
        zip: "",
        city: "",
        jyps_member: false,
        team: "",
        birth_year: "",
        sport_voucher: false,
        sport_voucher_name: "Smartum"
      },
      registration: false,
      confirm_content: null,
      submitAllowed: false,
      paymentdata: {
        name: "",
        paymentMethodName: "",
        price: 0,
        discount: 0,
        id: 0
      },
      sport_vouchers: [
        { value: "Smartum" },
        { value: "Epassi" },
        { value: "Edenred" },
        { value: "Eazybreak" },
        { value: "Tyky" }
      ]
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
    const query = qs.parse(this.props.location.search);
    if (query.payment_confirmed !== undefined) {
      if (query.payment_confirmed === "true") {
        this.setState({
          registration: true,
          confirm_content: (
            <div className="bp3-callout pt-intent-success">
              <h4 className="bp3-callout-title ">
                {" "}
                Ilmoittautuminen onnistui!{" "}
              </h4>
              Tervetuloa mukaan, saat sähköpostiisi vielä vahvistuksen
              kisamaksusta ja lisäohjeita!
            </div>
          )
        });
      }
    } else if (query.sport_voucher_received !== undefined) {
      if (query.sport_voucher_received === "true") {
        this.setState({
          registration: true,
          confirm_content: (
            <div className="bp3-callout pt-intent-success">
              <h4 className="bp3-callout-title ">
                {" "}
                Liikuntaseteli ilmottautumisesi on otettu vastaan!{" "}
              </h4>
              Kiitos ilmottautumisesta, saat vielä erillisen sähköpostin kun
              liikuntasetelimaksusi on hyväksytty, tällöin näyt myös
              osallistujalistalla.
            </div>
          )
        });
      }
    }
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
        p.groupid = response.groups[0].id;
        this.setState({
          participantdata: p,
          paymentdata: {
            name: response.groups[0].name,
            paymentMethodName: "",
            price: response.groups[0].price_prepay,
            discount: response.groups[0].discount,
            id: response.groups[0].id
          }
        });
      });
  }
  addParticipant() {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/participant", {
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
          window.location = 
            "/event/" +
              this.props.id +
              "/eventinfo/?sport_voucher_received=true"
          ;
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
      discount: 0
    };
    let e = Object.assign({}, this.state.participantdata);
    if (evt.target.id === "public") {
      e[evt.target.id] = !this.state.participantdata.public;
      this.setState({
        participantdata: e
      });
      this.validateFields(e);
      return;
    } else if (evt.target.id === "sport_voucher") {
      e[evt.target.id] = !this.state.participantdata.sport_voucher;
      if (e.sport_voucher) {
        e.paymentmethod = 2;
      } else {
        e.paymentmethod = 1;
      }
      this.setState({
        participantdata: e
      });
      this.validateFields(e);
      return;
    } else if (evt.target.id === "jyps_member") {
      e[evt.target.id] = !this.state.participantdata.jyps_member;
      //calculate jyps prices + also for "current payment data"
      let evtData = JSON.parse(JSON.stringify(this.state.eventdata));

      if (e.jyps_member) {
        evtData.groups.forEach(group => {
          group.price_prepay =
            parseInt(group.price_prepay) - parseInt(group.discount);
        });
      } else {
        evtData.groups.forEach(group => {
          group.price_prepay =
            parseInt(group.price_prepay) + parseInt(group.discount);
        });
      }

      let result = this.state.eventdata.groups.find(
        group => group.id === parseInt(e.groupid)
      );
      if (!this.state.participantdata.sport_voucher) {
        data.name = result.name;
        data.paymentMethodName = "Paytrail verkkomaksu";
        data.price = result.price_prepay;
      } else if (this.state.participantdata.sport_voucher) {
        data.name = result.name;
        data.paymentMethodName =
          "Liikuntasetelit (smartum, epassi...) paikanpäällä";
        data.price = result.price_prepay;
      }
      //e[evt.target.id] = parseInt(evt.target.value);

      if (this.state.participantdata.jyps_member) {
        data.price =
          result.price_prepay - data.discount - result.discount_amount;
      } else {
        data.price = result.price_prepay - result.discount_amount;
      }
      this.setState({
        participantdata: e,
        eventdata: evtData,
        paymentdata: data
      });
      this.validateFields(e);
      return;
    } else if (evt.target.id === "groupid") {
      // calc price
      let result = this.state.eventdata.groups.find(
        group => group.id === parseInt(evt.target.value, 10)
      );
      if (!this.state.participantdata.sport_voucher) {
        data.name = result.name;
        data.paymentMethodName = "Paytrail verkkomaksu";
        data.price = result.price_prepay;
      } else if (this.state.participantdata.sport_voucher) {
        data.name = result.name;
        data.paymentMethodName =
          "Liikuntasetelit (smartum, epassi...) paikanpäällä";
        data.price = result.price_prepay;
      }
      e[evt.target.id] = parseInt(evt.target.value);

      if (this.state.participantdata.jyps_member) {
        data.price =
          result.price_prepay - data.discount - result.discount_amount;
      }
      data.price = data.price - result.discount_amount;
      this.setState({
        paymentdata: data,
        participantdata: e
      });
    } else {
      e[evt.target.id] = evt.target.value;
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
      data.birth_year < 1900 ||
      data.groupid === 0
    ) {
      error = true;
    }
    if (error) {
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
      p = p - group.discount_amount;
      let left_now = group.racenumberrange_end - group.current_racenumber;
      g.push(
        <Radio
          key={group.id}
          label={
            group.name +
            ", Matka: " +
            group.distance +
            "km, Hinta: " +
            p +
            " euroa (" +
            left_now +
            " paikkaa jäljellä)"
          }
          id="groupid"
          value={group.id}
        />
      );
    });

    return g;
  }

  render() {
    let validationMessage = "";
    if (!this.state.submitAllowed) {
      validationMessage = (
        <div className="bp3-callout pt-intent-warning">
          <h4 className="bp3-callout-title"> Tarkista lomake </h4>
          Täytä lomakkeen tähdellä merkityt kentät, huomioithan että
          sähköpostiosoite on oikeaa muotoa ja syntymävuosi on merkattu 4
          numerolla{" "}
        </div>
      );
    } else if (
      this.state.submitAllowed &&
      !this.state.participantdata.sport_voucher
    ) {
      validationMessage = (
        <div className="bp3-callout pt-intent-success">
          <h4 className="bp3-callout-title"> Lomake kunnossa </h4>
          Voit jatkaa maksamiseen.Maksu hoidetaan verkkomaksuna Paytrail Oy: n
          palvelun välityksellä. <br />
          <b>
            Olet ilmoittautumassa sarjaan: {this.state.paymentdata.name}
          </b>{" "}
        </div>
      );
    } else if (
      this.state.submitAllowed &&
      this.state.participantdata.sport_voucher
    ) {
      validationMessage = (
        <div className="bp3-callout pt-intent-success">
          <h4 className="bp3-callout-title"> Lomake kunnossa </h4>
          Olet maksamassa ilmoittautumistasi liikuntaseteleillä.
          Ilmoittautumisesi vahvistetaan, kun toimitat maksuvahvistuksen
          osoitteeseen <a href="mailto:pj@jyps.fi">pj@jyps.fi</a> tai esität
          maksuvahvistuksen jossain JYPSin kevään tapahtumassa (
          <a href="https://www.jyps.fi">www.jyps.fi</a>). Nimesi ei näy
          osallistujalistalla ennen maksun vahvistamista. Saat erillisen
          sähköpostin, kun ilmoittautumisesi on hyväksytty
          <br />
          <b>
            Olet ilmoittautumassa sarjaan: {this.state.paymentdata.name}
          </b>{" "}
        </div>
      );
    }
    let result = (
      <Card interactive={false} elevation={Elevation.TWO}>
        <h5> Tapahtuman nimi </h5> {this.state.eventdata.name}{" "}
        <h5> Tapahtuman kuvaus </h5>
        {this.state.eventdata.general_description} <h5> Aika ja paikka </h5>{" "}
        {this.state.eventdata.date} {this.state.eventdata.location}{" "}
        <h5> Maksutavat </h5> {this.state.eventdata.payment_description}
        <h5> Sarjat ja matkat </h5> {this.state.eventdata.groups_description}
        {this.state.registration ? (
          this.state.confirm_content
        ) : (
          <div>
            <h5> Henkilötiedot </h5>{" "}
            <div className="input-w">
              <label htmlFor="firstname"> Etunimi * </label>{" "}
              <input
                className="bp3-input .modifier"
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
                className="bp3-input .modifier"
                type="text"
                dir="auto"
                id="lastname"
                onChange={this.handleChange}
              />{" "}
            </div>{" "}
            <div className="input-w">
              <label htmlFor="birth_year">
                {" "}
                Syntymävuosi (neljällä numerolla, esim. 1982) *{" "}
              </label>{" "}
              <input
                size="4"
                className="bp3-input .modifier"
                type="text"
                dir="auto"
                id="birth_year"
                onChange={this.handleChange}
              />{" "}
            </div>{" "}
            <div className="input-w">
              <label htmlFor="streetaddress"> Katuosoite * </label>{" "}
              <input
                className="bp3-input .modifier"
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
                className="bp3-input .modifier"
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
                className="bp3-input .modifier"
                type="text"
                dir="auto"
                id="city"
                onChange={this.handleChange}
              />{" "}
            </div>{" "}
            <div className="input-w">
              <label htmlFor="telephone"> Puhelin *: </label>{" "}
              <input
                className="bp3-input .modifier"
                type="text"
                dir="auto"
                size="30"
                id="telephone"
                onChange={this.handleChange}
              />{" "}
            </div>{" "}
            <div className="input-w">
              <label htmlFor="email">
                {" "}
                Sähköposti (huomaa oikea muoto, esim. teuvo@testaaja.com) *{" "}
              </label>{" "}
              <input
                size="30"
                className="bp3-input .modifier"
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
                className="bp3-input .modifier"
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
                className="bp3-input .modifier"
                type="text"
                dir="auto"
                id="team"
                onChange={this.handleChange}
              />{" "}
            </div>{" "}
            <Switch
              checked={this.state.participantdata.jyps_member}
              value={this.state.participantdata.jyps_member}
              id="jyps_member"
              label="JYPS Ry jäsen, erikoishinta"
              onChange={this.handleChange}
            />{" "}
            <Switch
              checked={this.state.participantdata.sport_voucher}
              value={this.state.participantdata.sport_voucher}
              id="sport_voucher"
              label="Maksan liikuntaedulla"
              onChange={this.handleChange}
            />{" "}
            {this.state.participantdata.sport_voucher ? (
              <HTMLSelect
                id="sport_voucher_name"
                options={this.state.sport_vouchers}
                onChange={this.handleChange}
              />
            ) : null}
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
            {this.state.eventdata.event_active ? (
              <div className="event-enroll-button">
                <Button
                  onClick={this.addParticipant}
                  disabled={!this.state.submitAllowed}
                >
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
