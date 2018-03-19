import React, { Component } from "react";
import { Button } from "@blueprintjs/core";
import { Link } from "react-router-dom";

class EventTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventrows: []
    };
    this.getEventsRows = this.getEventsRows.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.getEventsRows(nextProps.events);
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
            {this.props.loggedin ? (
              <div>
                <Button
                  id={item.id}
                  className="app-icon-button"
                  onClick={() => {
                    this.props.removeEvent(item.id);
                  }}
                  icon="trash"
                />
                <Button className="app-icon-button" onClick={this.props.editEvent} icon="edit" />
                <Link to={"/event/" + item.id}>
                  <Button className="app-icon-button" rightIcon="new-person">
                    Ilmoittautuminen ja lisätiedot
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <Link to={"/event/" + item.id}>
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
