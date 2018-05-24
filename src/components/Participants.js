import React, { Component } from "react";
import { Card, Elevation, Button, Icon } from "@blueprintjs/core";

class Participants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pariticipantrows: [],
      groups: []
    };
    this.getParticipants = this.getParticipants.bind(this);
    this.getRowElements = this.getRowElements.bind(this);
    this.removeParticipant = this.removeParticipant.bind(this);
    this.movePariticipant = this.movePariticipant.bind(this);
    this.getGroups = this.getGroups.bind(this);
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
        this.setState({ participantrows: this.getRowElements(r), groups: this.getGroups(r) });
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
  getGroups(json) {
    let groups = [];
    json.forEach(group => {
      groups.push(
        <a className="groups-list" href={"#" + group[0].group}>
          {group[0].group}
        </a>
      );
    });
    return groups;
  }
  getRowElements(json) {
    let ret = [];
    json.forEach(group => {
      let arr = [];
      group.forEach(item => {
        arr.push(
          <tr key={item.id}>
            <td>
              {item.firstname} {item.lastname}
            </td>
            <td>{item.club}</td>
            <td>{item.team}</td>
            <td>{item.group}</td>
            <td>{item.number}</td>
            <td>
              {this.props.loggedin ? (
                <div>
                  <Button
                    id={item.id}
                    className="app-icon-button"
                    onClick={() => {
                      this.removeParticipant(item.id);
                    }}
                    icon="trash"
                  />
                  {item.payment_confirmed ? (
                    <Icon className="paid-icon" icon="tick-circle" />
                  ) : (
                    <Icon className="paid-icon" icon="error" />
                  )}
                </div>
              ) : (
                ""
              )}
            </td>
          </tr>
        );
      });
      ret.push(
        <div>
          <h5 className="participant-table-header">
            <a name={group[0].group} >Sarja: {group[0].group}</a>
          </h5>
          <table className="pt-html-table pt-interactive event-table">
            <thead>
              <tr>
                <th>Nimi</th>
                <th>Seura</th>
                <th>Joukkue</th>
                <th>Sarja</th>
                <th>Alustava kilpailunumero</th>
                <th />
              </tr>
            </thead>
            <tbody>{arr}</tbody>
          </table>
        </div>
      );
    });
    return ret;
  }
  render() {
    let result = (
      <Card interactive={false} elevation={Elevation.TWO}>
        <p className="group-selector">Sarjat: {this.state.groups}</p>
        {this.state.participantrows}
      </Card>
    );
    return result;
  }
}
export default Participants;
