import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Events from "./components/Events";
import SingleEvent from "./components/Event";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <div className="App">
            <Switch>
              <Route exact path="/" component={Events} />
              <Route path="/event/:id" component={SingleEvent} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
