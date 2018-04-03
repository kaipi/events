import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Events from "./components/Events";
import SingleEvent from "./components/Event";
import NewEvent from "./components/NewEvent";
import Settings from "./components/Settings";
import Login from "./components/Login";
import EventEdit from "./components/EventEdit";
import Users from "./components/Users";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <div className="App">
            <Switch>
              <Route exact path="/" component={Events} />
              <Route path="/event/:id/:tabid" component={SingleEvent} />
              <Route path="/event/edit/:id" component={EventEdit} />
              <Route path="/event/pos/:id" component={EventEdit} />
              <Route path="/newevent" component={NewEvent} />
              <Route path="/settings" component={Settings} />
              <Route path="/users" component={Users} />
              <Route path="/login" component={Login} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
