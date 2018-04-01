import React, { Component } from "react";
import { Button, Card, Elevation, Intent } from "@blueprintjs/core";
import Navigation from "./Navigation";
import Group from "./Group";

class NewEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventdata: {
        description: "",
        date: "",
        location: "",
        paymentDescription: "",
        groupsDescription: "",
        groups: [],
        name: "",
        googlemaps_link: "",
        paytrail_product: "",
        email_template: ""
      },
      groups: [],
      loggedin: false
    };
    this.addGroup = this.addGroup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateData = this.updateData.bind(this);
    this.removeGroup = this.removeGroup.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
  }
  componentDidMount() {
    let loginboolean = false;
    if (localStorage.getItem("loggedin") === "true") {
      loginboolean = true;
    }
    this.setState({ loggedin: loginboolean });
  }
  addGroup() {
    let newevent = Object.assign({}, this.state.eventdata);
    newevent.groups.push({
      name: "",
      distance: 0.0,
      price_prepay: 0,
      price: 0,
      product_code: "",
      number_prefix: "",
      tagrange_start: 0,
      tagrange_end: 0,
      current_tag: 0,
      racenumberrange_start: 0,
      racenumberrange_end: 0,
      current_racenumber: 0,
      group_id: newevent.groups.length
    });
    let g = Object.assign([], this.state.groups);
    g.push(
      <Group id={g.length} key={g.length} removeGroup={this.removeGroup} handleGroupChange={this.handleGroupChange} />
    );
    this.setState({ groups: g, eventdata: newevent });
  }
  removeGroup(groupId) {
    let newevent = Object.assign({}, this.state.eventdata);
    let newgroups = Object.assign([], this.state.groups);
    newevent.groups.splice(groupId, 1);
    newgroups.splice(groupId, 1);
    this.setState({ eventdata: newevent, groups: newgroups });
  }
  handleGroupChange(id, evt) {
    let newevent = Object.assign({}, this.state.eventdata);
    newevent.groups[id][evt.target.id] = evt.target.value;
    this.setState({ eventdata: newevent });
  }
  handleChange(evt) {
    let newevent = Object.assign({}, this.state.eventdata);
    newevent[evt.target.id] = evt.target.value;
    this.setState({ eventdata: newevent });
  }
  updateData() {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/createevent", {
      method: "POST",
      body: JSON.stringify(this.state.eventdata),
      headers: {
        "Content-Type": "application/json",
        headers: { Authorization: "Bearer " + localStorage.getItem("jyps-jwt") }
      }
    })
      .then(response => {
        this.props.history.push("/");
      })
      .catch(error => {
        console.warn(error);
      });
  }
  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation loggedin={this.state.loggedin} addEvent={this.addEvent} />
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
            </p>
            <p>
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
            <h5>Tapahtuman kuvaus</h5>
            <p>
              {" "}
              <textarea
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={this.state.eventdata.description}
                rows="5"
                cols="50"
                id="description"
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
                value={this.state.eventdata.paymentDescription}
                rows={5}
                cols={50}
                id="paymentDescription"
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
                value={this.state.eventdata.groupsDescription}
                rows={5}
                cols={50}
                id="groupsDescription"
              />{" "}
            </p>
            {this.state.groups}
            <div className="new-event-create-buttons">
              <Button className="app-icon-button" onClick={this.addGroup} icon="add">
                Lisää sarja
              </Button>
              <Button className="app-icon-button" onClick={this.updateData} icon="add">
                Luo tapahtuma
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
    return result;
  }
}
export default NewEvent;
