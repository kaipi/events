import React, { Component } from "react";
import { Card, Elevation } from "@blueprintjs/core";
import Navigation from "./Navigation";
import { Button } from "@blueprintjs/core";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loggedin: false,
      userrows: [],
      newUser: { username: "", fullname: "", email: "" }
    };
    this.getUserRows = this.getUserRows.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.adduser = this.adduser.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.updateNewUser = this.updateNewUser.bind(this);
    this.getUserData = this.getUserData.bind(this);
  }
  componentDidMount() {
    let loginboolean = false;
    if (localStorage.getItem("loggedin") === "true") {
      loginboolean = true;
    }
    this.setState({ loggedin: loginboolean });
    this.getUserData();
  }
  getUserData() {
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
  deleteUser(id) {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/users/delete", {
      method: "DELETE",
      headers: { Authorization: "Bearer " + localStorage.getItem("jyps-jwt") }
    })
      .then(response => {
        return response.json();
      })
      .then(u => {
        this.setState({ users: u });
        this.getUserData();
      })
      .catch(error => {
        console.warn(error);
      });
  }
  adduser() {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/users/add", {
      method: "POST",
      headers: { Authorization: "Bearer " + localStorage.getItem("jyps-jwt"), "Content-Type": "application/json" },
      body: JSON.stringify(this.state.newUser)
    })
      .then(response => {
        return response.json();
      })
      .then(u => {
        this.setState({ users: u });
        this.getUserData();
      })
      .catch(error => {
        console.warn(error);
      });
  }
  resetPassword(id, email) {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/users/resetpassword/" + id, {
      method: "POST",
      headers: { Authorization: "Bearer " + localStorage.getItem("jyps-jwt"), "Content-Type": "application/json" },
      body: JSON.stringify({ email: email })
    })
      .then(response => {
        return response.json();
      })
      .then(u => {
        this.setState({ users: u });
        this.getUserData();
      })
      .catch(error => {
        console.warn(error);
      });
  }
  getUserRows() {
    let users = [];
    this.state.users.forEach(item => {
      users.push(
        <tr key={item.id}>
          <td>{item.username}</td>
          <td>{item.realname}</td>
          <td>{item.email}</td>
          <td>
            {" "}
            <Button
              className="app-icon-button"
              rightIcon="trash"
              onClick={() => {
                this.deleteUser(item.id);
              }}
            />
            <Button
              className="app-icon-button"
              rightIcon="refresh"
              onClick={() => {
                this.resetPassword(item.id, item.email);
              }}
            />
            <Button
              className="app-icon-button"
              rightIcon="floppy-disk"
              onClick={() => {
                this.updateSetting(item.id);
              }}
            />
          </td>
        </tr>
      );
    });
    this.setState({ userrows: users });
  }
  updateNewUser(evt) {
    let user = Object.assign({}, this.state.newUser);
    user[evt.target.id] = evt.target.value;
    this.setState({ newUser: user });
  }
  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation addEvent={this.addEvent} />
        </div>
        <div className="event-content">
          <Card interactive={false} elevation={Elevation.TWO}>
            <table className="bp3-html-table pt-interactive event-table">
              <thead>
                <tr>
                  <th>Käyttäjätunnus</th>
                  <th>Nimi</th>
                  <th>Email</th>
                  <th>Toiminnot</th>
                </tr>
              </thead>
              <tbody>
                {this.state.userrows}
                <tr>
                  <td>
                    {" "}
                    <input
                      class="bp3-input"
                      id="username"
                      type="text"
                      onChange={this.updateNewUser}
                      value={this.state.newUser.username}
                      placeholder="Käyttäjätunnus"
                      dir="auto"
                    />
                  </td>

                  <td>
                    {" "}
                    <input
                      class="bp3-input"
                      id="fullname"
                      type="text"
                      onChange={this.updateNewUser}
                      value={this.state.newUser.fullname}
                      placeholder="Kokonimi"
                      dir="auto"
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      class="bp3-input"
                      id="email"
                      type="text"
                      onChange={this.updateNewUser}
                      value={this.state.newUser.email}
                      placeholder="Email"
                      dir="auto"
                    />
                  </td>
                  <td>
                    <Button
                      className="app-icon-button"
                      rightIcon="new-person"
                      onClick={() => {
                        this.adduser();
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
    return result;
  }
}
export default Users;
