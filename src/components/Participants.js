import React, { Component } from "react";
import { Card, Elevation, Button, Icon, HTMLSelect } from "@blueprintjs/core";
import { checkJwtToken } from "../utils/auth";

class Participants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pariticipantrows: [],
      groupoptions: [],
      moveGroup: 0,
      moveParticipant: ""
    };
    this.getParticipants = this.getParticipants.bind(this);
    this.getRowElements = this.getRowElements.bind(this);
    this.removeParticipant = this.removeParticipant.bind(this);
    this.movePariticipant = this.movePariticipant.bind(this);
    this.getGroups = this.getGroups.bind(this);
    this.getGroupsOptions = this.getGroupsOptions.bind(this);
    this.getGroupData = this.getGroupData.bind(this);
    this.updateTargetGroup = this.updateTargetGroup.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.getParticipants(this.props.id);
    this.getGroupData(this.props.id);
  }
  updateTargetGroup(evt, id) {
    this.setState({ moveGroup: id, moveParticipant: evt.target.value });
  }
  getGroupData(id) {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/event/" + id, {
      method: "GET"
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        this.setState({
          groupoptions: this.getGroupsOptions(response.groups)
        });
      });
  }
  getParticipants(id) {
    let logged = checkJwtToken(localStorage.getItem("jyps-jwt"));

    //if (logged === true) {
    fetch(
      process.env.REACT_APP_JYPSAPI +
        "/api/events/v1/events/" +
        id +
        "/participants",
      {
        method: "GET"
      }
    )
      .then(result => {
        return result.json();
      })
      .then(r => {
        this.setState({
          participantrows: this.getRowElements(r),
          groups: this.getGroups(r)
        });
      });
    /*} else {
      fetch(
        process.env.REACT_APP_JYPSAPI +
          "/api/events/v1/events/" +
          id +
          "/participants_pos",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jyps-jwt")
          }
        }
      )
        .then(result => {
          return result.json();
        })
        .then(r => {
          this.setState({
            participantrows: this.getRowElements(r),
            groups: this.getGroups(r)
          });
        });
    }*/
  }
  removeParticipant(id) {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/participant/" + id, {
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
  movePariticipant() {
    fetch(
      process.env.REACT_APP_JYPSAPI +
        "/api/events/v1/events/movegroup/" +
        this.state.moveGroup +
        "/" +
        this.state.moveParticipant,
      {
        method: "PATCH",
        headers: { Authorization: "Bearer " + localStorage.getItem("jyps-jwt") }
      }
    )
      .then(response => {
        return response;
      })
      .then(response => {
        this.getParticipants(this.props.id);
      });
  }
  getGroups(json) {
    let groups = [];
    json.forEach(group => {
      if (group[0] !== undefined) {
        groups.push(
          <a className="groups-list" href={"#" + group[0].group}>
            {group[0].group}
          </a>
        );
      }
    });
    return groups;
  }
  getGroupsOptions(json) {
    let groups = [];
    json.forEach(group => {
      groups.push(<option value={group.id}>{group.name}</option>);
    });
    return groups;
  }
  getRowElements(json) {
    let ret = [];
    json.forEach(group => {
      if (group !== undefined) {
        let arr = [];
        group.forEach(item => {
          if (item.payment_confirmed === true) {
            arr.push(
              <tr key={item.id}>
                <td>
                  <span className="hide_in_desktop">Nimi: </span>
                  {item.firstname} {item.lastname}
                </td>
                <td>
                  <span className="hide_in_desktop">Seura: </span>
                  {item.club}
                </td>
                <td>
                  <span className="hide_in_desktop">Joukkue: </span>
                  {item.team}
                </td>
                <td>
                  <span className="hide_in_desktop">Sarja: </span>
                  {item.group}
                </td>
                <td>
                  <span className="hide_in_desktop">Alustava kisanumero: </span>
                  {item.number}
                </td>
                {this.props.loggedin ? (
                  <>
                    <td>
                      <Button
                        id={item.id}
                        className="app-icon-button"
                        onClick={() => {
                          this.removeParticipant(item.id);
                        }}
                        icon="trash"
                      />
                    </td>
                    <td>
                      {" "}
                      {item.payment_confirmed ? (
                        <Icon className="paid-icon" icon="tick-circle" />
                      ) : (
                        <Icon className="paid-icon" icon="error" />
                      )}
                    </td>
                    <td>
                      <HTMLSelect
                        onChange={e => this.updateTargetGroup(e, item.id)}
                      >
                        {this.state.groupoptions}
                      </HTMLSelect>
                      <Button
                        id={item.id}
                        className="app-icon-button"
                        onClick={() => {
                          this.movePariticipant();
                        }}
                        icon="arrow-right"
                      />
                    </td>
                  </>
                ) : (
                  ""
                )}
              </tr>
            );
          }
        });
        if (group[0] !== undefined) {
          ret.push(
            <div>
              <h5 className="participant-table-header">
                Sarja:{" "}
                <a href={group[0].group} name={group[0].group}>
                  {group[0].group}
                </a>
              </h5>
              <table className="bp3-html-table pt-interactive event-table">
                <thead>
                  {this.props.loggedin ? (
                    <tr>
                      <th>Nimi</th>
                      <th>Seura</th>
                      <th>Joukkue</th>
                      <th>Sarja</th>
                      <th>Alustava kilpailunumero</th>
                      <th>Poista</th>
                      <th>Maksun tila</th>
                      <th>Sarjan vaihto</th>
                    </tr>
                  ) : (
                    <tr>
                      <th>Nimi</th>
                      <th>Seura</th>
                      <th>Joukkue</th>
                      <th>Sarja</th>
                      <th>Alustava kilpailunumero</th>
                    </tr>
                  )}
                </thead>
                <tbody>{arr}</tbody>
              </table>
            </div>
          );
        }
      }
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
