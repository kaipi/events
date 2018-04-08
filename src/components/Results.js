import React, { Component } from "react";
import { Card, Elevation } from "@blueprintjs/core";

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pariticipantrows: ""
    };
  }

  render() {
    let result = (
      <Card interactive={false} elevation={Elevation.TWO}>
        <div className="event-info-search-container">
          <div className="pt-select event-info-search .modifier">
            <select defaultValue="Valitese sarja">
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
              <option value="4">Four</option>
            </select>
          </div>
          <div className="pt-input-group event-info-search .modifier">
            <span className="pt-icon pt-icon-search" />
            <input size="20" className="pt-input" type="search" placeholder="Haku" dir="auto" />
          </div>
        </div>
        <table className="pt-html-table pt-interactive event-table">
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Seura</th>
              <th>Sarja</th>
              <th>Numero</th>
              <th>Loppuaika</th>
            </tr>
          </thead>
          <tbody>{this.state.participantrows}</tbody>
        </table>
      </Card>
    );
    return result;
  }
}
export default Results;
