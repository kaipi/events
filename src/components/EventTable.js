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
          <td>
            <span className="hide_in_desktop">Tapahtuma: </span>
            {item.name}
          </td>
          <td>
            <span className="hide_in_desktop">Päivämäärä: </span>
            {item.date}
          </td>
          <td>
            <span className="hide_in_desktop">Ilmoittautuminen alkaa: </span>
            {item.open_date}
          </td>
          <td>
            <span className="hide_in_desktop">Ilmoittautuminen loppuu: </span>
            {item.close_date}
          </td>
          <td>
            <span className="hide_in_desktop">Sijainti: </span>
            <a href={item.googlemaps_link} target="_blank" rel="noopener noreferrer">
              {item.location}
            </a>
          </td>
          <td>
            {this.state.loggedin ? (
              <div>
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
                {item.close_date < Date.now ? (
                  <Link to={"/event/" + item.id + "/eventinfo"}>
                    <Button className="app-icon-button" rightIcon="new-person">
                      Ilmoittautuminen ja lisätiedot
                    </Button>
                  </Link>
                ) : (
                  ""
                )}
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
      <table className="bp3-html-table pt-interactive event-table">
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
