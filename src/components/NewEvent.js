import React, { Component } from "react";
import { Switch, Button, Card, Elevation, TextArea, Intent } from "@blueprintjs/core";
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
        paytrail: false,
        cash: false,
        sportVouchers: false,
        groupsDescription: "",
        groups: []
      },
      groups: []
    };
    this.addGroup = this.addGroup.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  addGroup() {
    let g = Object.assign([], this.state.g);
    g.push(<Group key={g.length} />);
    this.setState({ groups: g });
  }
  handleChange(evt) {
    let newevent = Object.assign({}, this.state.eventdata);
    newevent[evt.target.id] = evt.target.value;
    this.setState({ eventdata: newevent });
  }
  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation loggedIn={this.state.loggedin} addEvent={this.addEvent} />
        </div>
        <div className="event-content">
          <Card interactive={false} elevation={Elevation.TWO}>
            <h5>Tapahtuman kuvaus</h5>
            <p>
              {" "}
              <TextArea
                large={true}
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={this.state.eventdata.description}
                rows={10}
                cols={40}
                id="description"
              />{" "}
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
                id="location"
                onChange={this.handleChange}
                value={this.state.eventdata.location}
              />
            </p>
            <h5>Maksutavat</h5>
            <p>
              {" "}
              <TextArea
                large={true}
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={this.state.value}
                rows={10}
                cols={40}
                id="paymentDescription"
              />{" "}
            </p>
            <p>
              <Switch
                checked={this.state.isPublic}
                value={this.state.eventdata.paytrail}
                label="Paytrail"
                onChange={this.handleChange}
                id="paytrail"
              />
              <Switch
                checked={this.state.isPublic}
                label="Käteinen"
                value={this.state.eventdata.cash}
                onChange={this.handleChange}
                id="cash"
              />
              <Switch
                checked={this.state.isPublic}
                label="Liikuntasetelit"
                value={this.state.eventdata.sportVoucher}
                onChange={this.handleChange}
                id="sportVoucher"
              />
            </p>
            <h5>Sarjat ja matkat</h5>
            <p>
              {" "}
              <TextArea
                large={true}
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={this.state.value}
                rows={10}
                cols={40}
                id="groupsDescription"
              />{" "}
            </p>
            {this.state.groups}
            <div className="new-event-create-buttons">
              <Button className="app-icon-button" onClick={this.addGroup} icon="add">
                Lisää sarja
              </Button>
              <Button className="app-icon-button" onClick={this.addEvent} icon="add">
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
