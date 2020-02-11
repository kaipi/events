import React, { Component } from "react";
import {
  Button,
  Card,
  Elevation,
  Intent,
  HTMLSelect,
  Switch
} from "@blueprintjs/core";
import Navigation from "./Navigation";
import GroupEdit from "./GroupEdit";
import GroupAdd from "./GroupAdd";
import DiscountAdd from "./DiscountAdd";
class EventEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventdata: {
        general_description: "",
        date: "",
        location: "",
        payment_description: "",
        groups_description: "",
        groups: [{ distance: "" }],
        name: "",
        googlemaps_link: "",
        paytrail_product: "",
        email_template: "",
        close_date: "",
        open_date: "",
        event_active: false,
        sport_voucher_email: "",
        sport_voucher_confirmed_email: "",
        discount_steps: []
      },
      allEvents: [],
      groups: [],
      loggedin: false,
      sourceid: null,
      discounts: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateData = this.updateData.bind(this);
    this.removeGroup = this.removeGroup.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.getEventData = this.getEventData.bind(this);
    this.getGroups = this.getGroups.bind(this);
    this.removeEvent = this.removeEvent.bind(this);
    this.getDropdownEvents = this.getDropdownEvents.bind(this);
    this.copyGroups = this.copyGroups.bind(this);
    this.recalculateNumbers = this.recalculateNumbers.bind(this);
    this.getAllEvents = this.getAllEvents.bind(this);
    this.getDiscounts = this.getDiscounts.bind(this);
    this.removeDiscount = this.removeDiscount.bind(this);
  }
  componentDidMount() {
    let loginboolean = false;
    if (localStorage.getItem("loggedin") === "true") {
      loginboolean = true;
    }
    this.setState({ loggedin: loginboolean });
    //get eventdata
    this.getEventData();
    this.getAllEvents();
  }
  getAllEvents() {
    fetch(process.env.REACT_APP_JYPSAPI + "/v1/event/", {
      method: "GET"
    })
      .then(response => {
        return response.json();
      })
      .then(r => {
        this.setState({ allEvents: r });
      })
      .catch(error => {
        console.warn(error);
      });
  }
  getEventData() {
    fetch(
      process.env.REACT_APP_JYPSAPI +
        "/api/events/v1/event/" +
        this.props.match.params.id,
      {
        method: "GET"
      }
    )
      .then(response => {
        return response.json();
      })
      .then(response => {
        this.setState({ eventdata: response });
      });
  }
  getDiscounts() {
    let discounts = [];
    this.state.eventdata.discount_steps.forEach(discount => {
      discounts.push(
        <tr>
          <td>{discount.discount_amount}</td>
          <td>{discount.valid_from}</td>
          <td>
            {discount.valid_to}{" "}
            <Button
              className="app-icon-button"
              onClick={() => {
                this.removeDiscount(discount.id);
              }}
              icon="trash"
            />
          </td>
        </tr>
      );
    });
    return discounts;
  }
  removeGroup(groupId) {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/event/" + groupId, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jyps-jwt"),
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        this.getEventData();
      })
      .catch(error => {
        console.warn(error);
      });
  }
  handleGroupChange(id, evt) {
    let result = this.state.eventdata.groups.find(group => group.id === id);
    let newevent = Object.assign({}, this.state.eventdata);
    newevent.groups[this.state.eventdata.groups.indexOf(result)][
      evt.target.id
    ] = evt.target.value;
    this.setState({ eventdata: newevent });
  }
  handleChange(evt) {
    if (evt.target.id === "dropdown-copy") {
      this.setState({ sourceid: evt.target.value });
    } else {
      let newevent = Object.assign({}, this.state.eventdata);
      newevent[evt.target.id] = evt.target.value;
      this.setState({ eventdata: newevent });
    }
  }
  updateData() {
    fetch(
      process.env.REACT_APP_JYPSAPI +
        "/api/events/v1/event/" +
        this.props.match.params.id,
      {
        method: "PUT",
        body: JSON.stringify(this.state.eventdata),
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jyps-jwt"),
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => {
        this.getEventData();
      })
      .catch(error => {
        console.warn(error);
      });
  }
  removeEvent() {
    fetch(
      process.env.REACT_APP_JYPSAPI +
        "/api/events/v1/event/" +
        this.props.match.params.id,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jyps-jwt"),
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => {
        this.props.history.push("/");
      })
      .catch(error => {
        console.warn(error);
      });
  }
  recalculateNumbers(groupid) {
    fetch(
      process.env.REACT_APP_JYPSAPI + "/api/events/v1/recalculate/" + groupid,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jyps-jwt"),
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => {
        this.getEventData();
      })
      .catch(error => {
        console.warn(error);
      });
  }
  removeDiscount(discountid) {
    fetch(
      process.env.REACT_APP_JYPSAPI +
        "/api/events/v1/event/" +
        this.props.match.params.id +
        "/discount/" +
        discountid,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jyps-jwt"),
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => {
        this.getEventData();
      })
      .catch(error => {
        console.warn(error);
      });
  }
  getGroups() {
    let groups = [];
    this.state.eventdata.groups.forEach(group => {
      groups.push(
        <GroupEdit
          id={group.id}
          key={group.id}
          removeGroup={this.removeGroup}
          handleGroupChange={this.handleGroupChange}
          groupdata={group}
          recalculateNumbers={this.recalculateNumbers}
        />
      );
    });
    return groups;
  }
  getDropdownEvents() {
    let dropDownData = [];
    this.state.allEvents.forEach(item => {
      dropDownData.push({ label: item.name, value: item.id });
    });
    return dropDownData;
  }
  copyGroups(targetid, sourceid) {
    fetch(
      process.env.REACT_APP_JYPSAPI +
        "/api/events/v1/copygroups/" +
        this.props.match.params.id +
        "/" +
        this.state.sourceid,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jyps-jwt"),
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => {
        this.props.history.push("/eventedit/" + this.props.match.params.id);
      })
      .catch(error => {
        console.warn(error);
      });
  }
  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation addEvent={this.addEvent} />
        </div>
        <div className="event-content">
          <Card interactive={false} elevation={Elevation.TWO}>
            <h5>Tapahtuman nimi</h5>
            <p>
              {" "}
              <input
                className="bp3-input .modifier"
                type="text"
                placeholder="Tapahtuman nimi"
                dir="auto"
                size="50"
                id="name"
                onChange={this.handleChange}
                value={this.state.eventdata.name}
              />
            </p>
            <h5>Aika ja paikka</h5>
            <p>
              {" "}
              <input
                className="bp3-input .modifier"
                type="datetime"
                placeholder="Aika"
                dir="auto"
                id="date"
                onChange={this.handleChange}
                value={this.state.eventdata.date}
              />
              <input
                className="bp3-input .modifier"
                type="text"
                placeholder="Paikka"
                dir="auto"
                size="25"
                id="location"
                onChange={this.handleChange}
                value={this.state.eventdata.location}
              />
              <input
                className="bp3-input .modifier"
                type="text"
                placeholder="Google maps linkki"
                dir="auto"
                size="50"
                id="googlemaps_link"
                onChange={this.handleChange}
                value={this.state.eventdata.googlemaps_link}
              />
            </p>
            <h5>Ilmoittautuminen alkaa/päättyy</h5>
            <p>
              <input
                className="bp3-input .modifier"
                type="datetime"
                placeholder="Ilmoittautuminen sulkeutuu"
                dir="auto"
                id="open_date"
                onChange={this.handleChange}
                value={this.state.eventdata.open_date}
              />
              <input
                className="bp3-input .modifier"
                type="datetime"
                placeholder="Ilmoittautuminen sulkeutuu"
                dir="auto"
                id="close_date"
                onChange={this.handleChange}
                value={this.state.eventdata.close_date}
              />
            </p>
            <h5>Tapahtuman kuvaus</h5>
            <p>
              {" "}
              <textarea
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={this.state.eventdata.general_description}
                rows="5"
                cols="50"
                id="general_description"
              />{" "}
            </p>
            <h5>Maksutavat</h5>
            <p>
              <input
                className="bp3-input .modifier"
                type="text"
                placeholder="Paytrail tuote"
                dir="auto"
                size="50"
                id="paytrail_product"
                onChange={this.handleChange}
                value={this.state.eventdata.paytrail_product}
              />
            </p>
            <p>
              {" "}
              <textarea
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={this.state.eventdata.payment_description}
                rows={5}
                cols={50}
                id="payment_description"
              />{" "}
            </p>
            <h5>Vahvistussähköposti</h5>
            <p>
              {" "}
              <textarea
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={this.state.eventdata.email_template}
                rows={5}
                cols={50}
                id="email_template"
              />{" "}
            </p>
            <h5>Liikuntasetelin vahvistusmaili</h5>
            <p>
              {" "}
              <textarea
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={this.state.eventdata.sport_voucher_confirmed_email}
                rows={5}
                cols={50}
                id="sport_voucher_confirmed_email"
              />{" "}
            </p>
            <h5>Liikuntasetelin vastaanottoviesti</h5>
            <p>
              {" "}
              <textarea
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={this.state.eventdata.sport_voucher_email}
                rows={5}
                cols={50}
                id="sport_voucher_email"
              />{" "}
            </p>
            <h5>Sarjat ja matkat</h5>
            <p>
              {" "}
              <textarea
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={this.state.eventdata.groups_description}
                rows={5}
                cols={50}
                id="groups_description"
              />{" "}
            </p>
            <Switch
              checked={this.state.eventdata.event_active}
              value={this.state.eventdata.event_active}
              id="event_active"
              label="Tapahtuma aktiivinen"
              onChange={this.handleChange}
            />{" "}
            Olethan varovainen poistaessasi ryhmiä, jos ryhmässä on jäseniä myös
            jäsenet poistuvat!
            {this.getGroups()}
            <br />
            <h5>Lisää uusi sarja</h5>
            <GroupAdd
              eventId={this.props.match.params.id}
              getEventData={this.getEventData}
            />
            <h5>Alennukset</h5>
            <table>
              <tr>
                <th>Summa</th>
                <th>Alkaen</th>
                <th>Loppuen</th>
              </tr>
              {this.getDiscounts()}
            </table>
            <h5>Lisää uusi alennus</h5>
            <DiscountAdd
              eventId={this.props.match.params.id}
              getEventData={this.getEventData}
            />
            <div className="new-event-create-buttons">
              <Button
                className="app-icon-button"
                onClick={this.updateData}
                icon="add"
              >
                Tallenna muutokset
              </Button>
              <Button
                className="app-icon-button"
                onClick={this.removeEvent}
                icon="remove"
              >
                Poista tapahtuma
              </Button>
              <HTMLSelect
                id="dropdown-copy"
                options={this.getDropdownEvents()}
                onChange={this.handleChange}
              />
              <Button
                className="app-icon-button"
                onClick={this.copyGroups}
                icon="remove"
              >
                Kopioi sarjat
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
    return result;
  }
}
export default EventEdit;
