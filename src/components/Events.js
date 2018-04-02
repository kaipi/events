import React, { Component } from "react";
import Navigation from "./Navigation";
import EventTable from "./EventTable";
import { Card, Elevation } from "@blueprintjs/core";
import { checkJwtToken } from "../utils/auth";
class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
    this.removeEvent = this.removeEvent.bind(this);
    this.getEvents = this.getEvents.bind(this);
  }
  componentDidMount() {
    this.getEvents();
    this.setState({ loggedin: checkJwtToken(localStorage.getItem("jyps-jwt")) });
  }

  getEvents() {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/event/allevents", {
      method: "GET"
    })
      .then(response => {
        return response.json();
      })
      .then(r => {
        this.setState({ events: r });
      })
      .catch(error => {
        console.warn(error);
      });
  }
  removeEvent(id) {
    let payload = JSON.stringify({ id: id });
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/deleteevent", {
      method: "DELETE",
      body: payload,
      headers: {
        "Content-Type": "application/json",
        headers: { Authorization: "Bearer " + localStorage.getItem("jyps-jwt") }
      }
    }).then(response => {
      this.getEvents();
    });
  }
  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation logout={this.logout} addEvent={this.addEvent} history={this.props.history} />
        </div>
        <div className="event-content">
          <Card interactive={false} elevation={Elevation.TWO}>
            <EventTable
              events={this.state.events}
              removeEvent={this.removeEvent}
              editEvent={this.editEvent}
              showDetails={this.showDetails}
              logout={this.logout}
            />
          </Card>
        </div>
      </div>
    );
    return result;
  }
}
export default Events;
