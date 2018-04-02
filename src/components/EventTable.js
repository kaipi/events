import React, { Component } from "react";
import { Button } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import { checkJwtToken } from "../utils/auth";

class EventTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventrows: [],
      loggedin: false
    };
    this.getEventsRows = this.getEventsRows.bind(this);
    this.getTimingCSV = this.getTimingCSV.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.getEventsRows(nextProps.events);
  }
  componentDidMount() {
    this.setState({ loggedin: checkJwtToken(localStorage.getItem("jyps-jwt")) });
  }
  getTimingCSV(id) {
    window.alert("Ajanotto CSV tapahtumalle " + id + " tuleepi tästä!");
  }
  getEventsRows(prop) {
    let eventrows = [];
    prop.forEach(item => {
      eventrows.push(
        <tr key={item.id}>
          <td>{item.name}</td>
          <td>{item.date}</td>
          <td>
            <a href={item.googlemaps_link} target="_blank">
              {item.location}
            </a>
          </td>
          <td>
            {this.state.loggedin ? (
              <div>
                <Button
                  id={item.id}
                  className="app-icon-button"
                  onClick={() => {
                    this.props.removeEvent(item.id);
                  }}
                  icon="trash"
                />
                <Link to={"/event/" + item.id + "/edit"}>
                  <Button className="app-icon-button" icon="edit" />
                </Link>
                <Button
                  className="app-icon-button"
                  icon="time"
                  onClick={() => {
                    this.getTimingCSV(item.id);
                  }}
                />
                <Link to={"/event/" + item.id + "/eventinfo"}>
                  <Button className="app-icon-button" rightIcon="new-person">
                    Ilmoittautuminen ja lisätiedot
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <Link to={"/event/" + item.id + "/eventinfo"}>
                  <Button className="app-icon-button" rightIcon="new-person">
                    Ilmoittautuminen ja lisätiedot
                  </Button>
                </Link>
              </div>
            )}
          </td>
        </tr>
      );
    });
    this.setState({ eventrows: eventrows });
  }
  render() {
    let result = (
      <table className="pt-html-table pt-interactive event-table">
        <thead>
          <tr>
            <th>Tapahtuma</th>
            <th>Aika</th>
            <th>Paikka</th>
            <th />
          </tr>
        </thead>
        <tbody>{this.state.eventrows}</tbody>
      </table>
    );
    return result;
  }
}
export default EventTable;
