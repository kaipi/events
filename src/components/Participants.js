import React, { Component } from "react";
import { Card, Elevation } from "@blueprintjs/core";

class Participants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pariticipantrows: ""
    };
    this.getParticipants = this.getParticipants.bind(this);
  }

  componentWillMount() {
    this.getParticipants(this.props.id);
  }
  getParticipants() {}
  render() {
    let result = (
      <Card interactive={false} elevation={Elevation.TWO}>
        <table className="pt-html-table pt-interactive event-table">
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Seura</th>
              <th>Sarja</th>
              <th>Numero</th>
            </tr>
          </thead>
          <tbody>{this.state.participantrows}</tbody>
        </table>
      </Card>
    );
    return result;
  }
}
export default Participants;
