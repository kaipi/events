// src/routes.js
import React from "react";
import { Router, Route } from "react-router";

import App from "./components/App";
import Login from "./components/Login";

const Routes = props => (
  <Router {...props}>
    <Route path="/" component={App} />
    <Route path="/login" component={Login} />
  </Router>
);

export default Routes;
