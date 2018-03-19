import React, { Component } from "react";
import Navigation from "./Navigation";
import EventTable from "./EventTable";
import { Card, Elevation } from "@blueprintjs/core";

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      loggedin: false
    };
    this.removeEvent = this.removeEvent.bind(this);
    this.getEvents = this.getEvents.bind(this);
    this.logout = this.logout.bind(this);
  }
  componentDidMount() {
    this.getEvents();
    let loginboolean = false;
    if (localStorage.getItem("loggedin") === "true") {
      loginboolean = true;
    }
    this.setState({ loggedin: loginboolean });
  }
  logout() {
    const { history } = this.props;
    localStorage.removeItem("jyps-jwt");
    localStorage.setItem("loggedin", false);
    this.setState({ loggedin: false });
    history.push("/");
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
        "Content-Type": "application/json"
      }
    }).then(response => {
      this.getEvents();
    });
  }
  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation
            logout={this.logout}
            addEvent={this.addEvent}
            history={this.props.history}
            loggedin={this.state.loggedin}
          />
        </div>
        <div className="event-content">
          <Card interactive={false} elevation={Elevation.TWO}>
            <EventTable
              events={this.state.events}
              removeEvent={this.removeEvent}
              editEvent={this.editEvent}
              showDetails={this.showDetails}
              loggedin={this.state.loggedin}
            />
          </Card>
        </div>
      </div>
    );
    return result;
  }
}
export default Events;
