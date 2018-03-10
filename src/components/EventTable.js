import React, { Component } from "react";
import { Button } from "@blueprintjs/core";
import { Link } from "react-router-dom";

class EventTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfo: false,
      eventrows: []
    };
    this.getEventsRows = this.getEventsRows.bind(this);
  }
  componentDidMount() {
    this.getEventsRows();
  }
  getEventsRows() {
    let eventrows = [];
    this.props.events.forEach(item => {
      eventrows.push(
        <tr key={item.id}>
          <td>{item.name}</td>
          <td>{item.date}</td>
          <td>
            <Link to={"https://www.google.com/maps/search/?api=1&query=" + item.location} target="_blank">
              {item.location}
            </Link>
          </td>
          <td>
            <Button className="app-icon-button" onClick={this.props.removeEvent} icon="trash" />
            <Button className="app-icon-button" onClick={this.props.editEvent} icon="edit" />
            <Link to={"/event/" + item.id}>
              <Button className="app-icon-button" icon="plus">
                Ilmottaudu
              </Button>
            </Link>
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
            <th>Toiminnot</th>
          </tr>
        </thead>
        <tbody>{this.state.eventrows}</tbody>
      </table>
    );
    return result;
  }
}
export default EventTable;
