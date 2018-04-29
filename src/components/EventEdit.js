import React, { Component } from "react";
import { Button, Card, Elevation, Intent } from "@blueprintjs/core";
import Navigation from "./Navigation";
import GroupEdit from "./GroupEdit";
import GroupAdd from "./GroupAdd";

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
        open_date: ""
      },
      groups: [],
      loggedin: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateData = this.updateData.bind(this);
    this.removeGroup = this.removeGroup.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.getEventData = this.getEventData.bind(this);
    this.getGroups = this.getGroups.bind(this);
  }
  componentDidMount() {
    let loginboolean = false;
    if (localStorage.getItem("loggedin") === "true") {
      loginboolean = true;
    }
    this.setState({ loggedin: loginboolean });
    //get eventdata
    this.getEventData();
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
      });
  }

  removeGroup(groupId) {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/deletegroup/" + groupId, {
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
    newevent.groups[this.state.eventdata.groups.indexOf(result)][evt.target.id] = evt.target.value;
    this.setState({ eventdata: newevent });
  }
  handleChange(evt) {
    let newevent = Object.assign({}, this.state.eventdata);
    newevent[evt.target.id] = evt.target.value;
    this.setState({ eventdata: newevent });
  }
  updateData() {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/event/update/" + this.props.match.params.id, {
      method: "POST",
      body: JSON.stringify(this.state.eventdata),
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
        />
      );
    });
    return groups;
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
                className="pt-input .modifier"
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
                className="pt-input .modifier"
                type="date"
                placeholder="Aika"
                dir="auto"
                id="date"
                onChange={this.handleChange}
                value={this.state.eventdata.date}
              />
              <input
                className="pt-input .modifier"
                type="text"
                placeholder="Paikka"
                dir="auto"
                size="25"
                id="location"
                onChange={this.handleChange}
                value={this.state.eventdata.location}
              />
              <input
                className="pt-input .modifier"
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
                className="pt-input .modifier"
                type="date"
                placeholder="Ilmoittautuminen sulkeutuu"
                dir="auto"
                id="open_date"
                onChange={this.handleChange}
                value={this.state.eventdata.open_date}
              />
              <input
                className="pt-input .modifier"
                type="date"
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
                className="pt-input .modifier"
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
            Olethan varovainen poistaessasi ryhmiä, jos ryhmässä on jäseniä myös jäsenet poistuvat!
            {this.getGroups()}
            <br />
            <h5>Lisää uusi sarja</h5>
            <GroupAdd eventId={this.props.match.params.id} getEventData={this.getEventData} />
            <div className="new-event-create-buttons">
              <Button className="app-icon-button" onClick={this.updateData} icon="add">
                Tallenna muutokset
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
