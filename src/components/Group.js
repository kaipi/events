import React, { Component } from "react";
import { Button } from "@blueprintjs/core";

class Group extends Component {
  render() {
    let result = (
      <div className="new-event-group-row">
        <input className="pt-input .modifier" type="text" placeholder="Sarjannimi" dir="auto" />
        <input className="pt-input .modifier" type="text" placeholder="Matka" dir="auto" />
        <input className="pt-input .modifier" type="text" placeholder="Hinta ennakkoon (verkkomaksu)" dir="auto" />

        <input
          className="pt-input .modifier"
          type="text"
          placeholder="Hinta kisapäivänä (käteinen/liikuntasetelit)"
          dir="auto"
        />
        <input className="pt-input .modifier" type="text" placeholder="Sarjakoodi (esim. M30)" dir="auto" />
        <input className="pt-input .modifier" type="text" placeholder="Tagirange alku" dir="auto" />
        <input className="pt-input .modifier" type="text" placeholder="Tagirange loppu" dir="auto" />

        <Button className="app-icon-button" onClick={this.props.removeGroup} icon="trash" />
      </div>
    );
    return result;
  }
}
export default Group;
