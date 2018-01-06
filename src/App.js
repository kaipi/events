import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Admin from "./components/Admin";
import Login from "./components/Login";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route path="/login" component={Login} />
          <Route path="/admin" component={Admin} />
        </div>
      </Router>
    );
  }
}

export default App;
