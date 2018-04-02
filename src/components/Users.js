import React, { Component } from "react";
import { Card, Elevation } from "@blueprintjs/core";
import Navigation from "./Navigation";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loggedin: false,
      userrows: []
    };
    this.getUserRows = this.getUserRows.bind(this);
  }
  componentDidMount() {
    let loginboolean = false;
    if (localStorage.getItem("loggedin") === "true") {
      loginboolean = true;
    }
    this.setState({ loggedin: loginboolean });
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/users/allusers", {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorage.getItem("jyps-jwt") }
    })
      .then(response => {
        return response.json();
      })
      .then(u => {
        this.setState({ users: u });
        this.getUserRows();
      })
      .catch(error => {
        console.warn(error);
      });
  }
  deleteUser(id) {}
  adduser() {}
  getUserRows() {
    let users = [];
    this.state.users.forEach(item => {
      users.push(
        <tr key={item.id}>
          <td>{item.username}</td>
          <td>{item.realname}</td>
          <td>{item.email}</td>
        </tr>
      );
    });
    this.setState({ userrows: users });
  }
  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation addEvent={this.addEvent} />
        </div>
        <div className="event-content">
          <Card interactive={false} elevation={Elevation.TWO}>
            <table className="pt-html-table pt-interactive event-table">
              <thead>
                <tr>
                  <th>Käyttäjätunnus</th>
                  <th>Nimi</th>
                  <th>Email</th>
                  <th />
                </tr>
              </thead>
              <tbody>{this.state.userrows}</tbody>
            </table>
          </Card>
        </div>
      </div>
    );
    return result;
  }
}
export default Users;
