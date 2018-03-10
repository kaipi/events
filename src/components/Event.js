import React, { Component } from "react";
import Navigation from "./Navigation";
import { Tab, Tabs } from "@blueprintjs/core";
import EventInfo from "./EventInfo";
import Participants from "./Participants";

class SingleEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: "event-info"
    };
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(e) {
    this.setState({ currentTab: e });
  }
  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation loggedIn={this.state.loggedin} addEvent={this.addEvent} />
        </div>
        <div className="event-content">
          <Tabs id="event-tabs" onChange={this.handleTabChange} selectedTabId={this.state.currentTab}>
            <Tab id="event-info" title="Tapahtuma ja Ilmoittautuminen" panel={<EventInfo />} />
            <Tab id="participants" title="Osallistujat" panel={<Participants />} />
            <Tabs.Expander />
          </Tabs>
        </div>
      </div>
    );
    return result;
  }
}
export default SingleEvent;
