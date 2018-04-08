import React, { Component } from "react";
import Navigation from "./Navigation";
import { Tab, Tabs } from "@blueprintjs/core";
import EventInfo from "./EventInfo";
import Participants from "./Participants";
import Results from "./Results";
import { checkJwtToken } from "../utils/auth";

class SingleEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: "eventinfo",
      loggedin: false
    };
    this.handleTabChange = this.handleTabChange.bind(this);
  }
  componentDidMount() {
    this.setState({
      currentTab: this.props.match.params.tabid,
      loggedin: checkJwtToken(localStorage.getItem("jyps-jwt"))
    });
  }
  handleTabChange(e) {
    this.setState({ currentTab: e });
  }
  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation loggedin={this.state.loggedin} addEvent={this.addEvent} />
        </div>
        <div className="event-content">
          <Tabs id="event-tabs" onChange={this.handleTabChange} selectedTabId={this.state.currentTab}>
            <Tab
              id="eventinfo"
              title="Tapahtuma ja Ilmoittautuminen"
              panel={<EventInfo id={this.props.match.params.id} showNotification={this.showNotification} />}
            />
            <Tab
              id="participants"
              title="Osallistujat"
              panel={<Participants loggedin={this.state.loggedin} id={this.props.match.params.id} />}
            />
            <Tabs.Expander />
          </Tabs>
        </div>
      </div>
    );
    return result;
  }
}
export default SingleEvent;
