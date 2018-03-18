import React, { Component } from "react";
import { Card, Elevation, Button } from "@blueprintjs/core";

class Participants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pariticipantrows: []
    };
    this.getParticipants = this.getParticipants.bind(this);
    this.getRowElements = this.getRowElements.bind(this);
    this.removeParticipant = this.removeParticipant.bind(this);
    this.movePariticipant = this.movePariticipant.bind(this);
  }

  componentWillMount() {
    this.getParticipants(this.props.id);
  }
  getParticipants(id) {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/data/v1/events/" + id + "/participants", {
      method: "GET"
    })
      .then(result => {
        return result.json();
      })
      .then(r => {
        this.setState({ participantrows: this.getRowElements(r) });
      });
  }
  removeParticipant() {}
  movePariticipant() {}
  getRowElements(json) {
    let arr = [];
    json.forEach(item => {
      arr.push(
        <tr key={item.id}>
          <td>
            {item.firstname} {item.lastname}
          </td>
          <td>{item.club}</td>
          <td>{item.group}</td>
          <td>{item.number}</td>
          <td>
            {this.props.loggedin ? (
              <Button
                id={item.id}
                className="app-icon-button"
                onClick={() => {
                  this.removeParticipant(item.id);
                }}
                icon="trash"
              />
            ) : (
              ""
            )}
          </td>
        </tr>
      );
    });
    return arr;
  }
  render() {
    let result = (
      <Card interactive={false} elevation={Elevation.TWO}>
        <table className="pt-html-table pt-interactive event-table">
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Seura</th>
              <th>Sarja</th>
              <th>Alustava kilpailunumero</th>
              <th />
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
