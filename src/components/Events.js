import React, { Component } from "react";
import Navigation from "./Navigation";
import EventTable from "./EventTable";
import { Card, Elevation } from "@blueprintjs/core";

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      events: []
    };
    this.removeEvent = this.removeEvent.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.showDetails = this.showDetails.bind(this);
    this.getEvents = this.getEvents.bind(this);
  }
  componentDidMount() {
    this.getEvents();
  }
  getEvents() {
    fetch("http://localhost:5000/api/data/v1/events/allevents", {
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
  addEvent() {}
  removeEvent(id) {
    let payload = JSON.stringify({ id: id });
    fetch("http://localhost:5000/api/data/v1/events/auth/deleteevent", {
      method: "DELETE",
      body: payload,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
      this.getEvents();
    });
  }
  editEvent() {}
  showDetails() {}
  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation loggedIn={this.state.loggedin} addEvent={this.addEvent} />
        </div>
        <div className="event-content">
          <Card interactive={false} elevation={Elevation.TWO}>
            <EventTable
              events={this.state.events}
              removeEvent={this.removeEvent}
              editEvent={this.editEvent}
              showDetails={this.showDetails}
            />
          </Card>
        </div>
      </div>
    );
    return result;
  }
}
export default Events;
