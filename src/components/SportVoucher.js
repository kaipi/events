import React, { Component } from "react";
import { Card, Elevation, Button } from "@blueprintjs/core";

class SportVoucher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pariticipantrows: [],
      groups: []
    };
    this.getParticipants = this.getParticipants.bind(this);
    this.getRowElements = this.getRowElements.bind(this);
    this.approveParticipant = this.approveParticipant.bind(this);
  }

  componentDidMount() {
    this.getParticipants(this.props.id);
  }
  getParticipants(id) {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/sportvoucherpending/" + this.props.id, {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorage.getItem("jyps-jwt") }
    })
      .then(result => {
        return result.json();
      })
      .then(json => {
        this.setState({ participantrows: this.getRowElements(json) });
      });
  }
  approveParticipant(id) {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/approvevoucher/" + id, {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorage.getItem("jyps-jwt") }
    })
      .then(result => {
        return result;
      })
      .then(r => {
        this.setState({ participantrows: this.getParticipants(this.props.id) });
      });
  }

  getRowElements(json) {
    let ret = [];
    let arr = [];
    json.forEach(participant => {
      arr.push(
        <tr key={participant.id}>
          <td>
            {participant.firstname} {participant.surname}
          </td>
          <td>{participant.phone}</td>
          <td>{participant.sport_voucher_name}</td>
          <td>
            <Button
              id={participant.id}
              className="app-icon-button"
              onClick={() => {
                this.approveParticipant(participant.id);
              }}
              icon="confirm"
            />
          </td>
        </tr>
      );
    });
    ret.push(
      <div>
        <h5 className="participant-table-header">Osallistujat</h5>
        <table className="bp3-html-table pt-interactive event-table">
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Puhelin</th>
              <th>Liikuntaseteli</th>
              <th>Hyväksy maksu </th>
            </tr>
          </thead>
          <tbody>{arr}</tbody>
        </table>
      </div>
    );
    return ret;
  }
  render() {
    let result = (
      <Card interactive={false} elevation={Elevation.TWO}>
        <h3>Hyväksymistä odottavat liikuntasetelimaksut</h3>
        {this.state.participantrows}
      </Card>
    );
    return result;
  }
}
export default SportVoucher;
