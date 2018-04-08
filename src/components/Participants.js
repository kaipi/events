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
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/events/" + id + "/participants", {
      method: "GET"
    })
      .then(result => {
        return result.json();
      })
      .then(r => {
        this.setState({ participantrows: this.getRowElements(r) });
      });
  }
  removeParticipant(id) {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/deleteparticipant/" + id, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + localStorage.getItem("jyps-jwt") }
    })
      .then(result => {
        return result;
      })
      .then(r => {
        this.setState({ participantrows: this.getParticipants(this.props.id) });
      });
  }
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
        <div className="event-info-search-container">
          <div className="pt-select event-info-search .modifier ">
            <select defaultValue="Valitese sarja">
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
              <option value="4">Four</option>
            </select>
          </div>
          <div className="pt-input-group event-info-search .modifier">
            <span className="pt-icon pt-icon-search" />
            <input size="20" className="pt-input" type="search" placeholder="Haku" dir="auto" />
          </div>
        </div>
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
