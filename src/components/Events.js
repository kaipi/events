import React, { Component } from "react";
import Navigation from "./Navigation";
import EventTable from "./EventTable";
class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      events: [
        { id: 1, name: "TestiEventti", date: "2018-01-01", location: "Laajavuori" },
        { id: 2, name: "ToinenTestiEventti", date: "2018-01-01", location: "Tikkakoski" }
      ]
    };
    this.removeEvent = this.removeEvent.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.showDetails = this.showDetails.bind(this);
  }

  addEvent() {}
  removeEvent() {}
  editEvent() {}
  showDetails() {}
  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation loggedIn={this.state.loggedin} addEvent={this.addEvent} />
        </div>
        <EventTable
          events={this.state.events}
          removeEvent={this.removeEvent}
          editEvent={this.editEvent}
          showDetails={this.showDetails}
        />
      </div>
    );
    return result;
  }
}
export default Events;
