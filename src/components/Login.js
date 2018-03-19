import React, { Component } from "react";
import Navigation from "./Navigation";
import { Button, Card, Elevation } from "@blueprintjs/core";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "", errorMessage: "" };
    this.loginHandler = this.loginHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  loginHandler() {
    const { history } = this.props;

    fetch(process.env. + "/api/events/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state)
    })
      .then(response => {
        if (response.status !== 200) {
          this.setState({ errorMessage: "Login rejected" });
        } else {
          return response.json();
        }
      })
      .then(response => {
        localStorage.setItem("jyps-jwt", response.jwt);
        localStorage.setItem("loggedin", true);
        history.push("/");
      })
      .catch(error => {
        console.warn(error);
      });
  }
  handleChange(evt) {
    let s = Object.assign({}, this.state);
    s[evt.target.id] = evt.target.value;
    this.setState({ username: s.username, password: s.password });
  }
  render() {
    let result = (
      <div className="content">
        <div className="navigation">
          <Navigation loggedIn={this.state.loggedin} addEvent={this.addEvent} />
        </div>
        <div className="event-content" />
        <Card interactive={false} elevation={Elevation.TWO}>
          <div className="login-prompt">
            <h5>Kirjaudu sisään</h5>
            <p>
              <input
                className="pt-input .modifier"
                type="text"
                placeholder="Username"
                dir="auto"
                id="username"
                onChange={this.handleChange}
                value={this.state.username}
              />
            </p>
            <p>
              <input
                className="pt-input .modifier"
                type="password"
                placeholder="Password"
                dir="auto"
                onChange={this.handleChange}
                id="password"
                value={this.state.password}
              />
            </p>
            <Button className="app-icon-button" onClick={this.loginHandler} icon="log-in">
              Login
            </Button>
            <div className="login-errormessage">{this.state.errorMessage}</div>
          </div>
        </Card>
      </div>
    );
    return result;
  }
}
export default Login;
