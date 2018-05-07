import React, { Component } from "react";
import { Button } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import { checkJwtToken } from "../utils/auth";
var fileDownload = require("js-file-download");

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
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/" + id + "/chrono", {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorage.getItem("jyps-jwt") }
    })
      .then(response => {
        return response.text();
      })
      .then(resp => {
        fileDownload(resp, "chrono_input_" + id + "_" + Date.now() + ".csv");
      })
      .catch(r => {
        console.log(r);
      });
  }
  getEventsRows(prop) {
    let eventrows = [];
    prop.forEach(item => {
      eventrows.push(
        <tr key={item.id}>
          <td>{item.name}</td>
          <td>{item.date}</td>
          <td>{item.open_date}</td>
          <td>{item.close_date}</td>
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
                <Link to={"/eventedit/" + item.id}>
                  <Button className="app-icon-button" icon="edit" />
                </Link>
                <Button
                  className="app-icon-button"
                  icon="time"
                  onClick={() => {
                    this.getTimingCSV(item.id);
                  }}
                />
                <Link to={"/eventpos/" + item.id}>
                  <Button className="app-icon-button" icon="people" />
                </Link>
                <Link to={"/event/" + item.id + "/eventinfo"}>
                  <Button className="app-icon-button" rightIcon="new-person" />
                </Link>
              </div>
            ) : (
              <div>
                {item.close_date >= Date.now ? (
                  <Link to={"/event/" + item.id + "/eventinfo"}>
                    <Button className="app-icon-button" rightIcon="new-person">
                    Ilmoittautuminen ja lisätiedot
                    </Button>
                  </Link>
                ):("")}
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
            <th>Ennakkoilmoittautuminen alkaa</th>
            <th>Ennakkoilmoittautuminen päättyy</th>
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
