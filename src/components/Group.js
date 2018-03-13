import React, { Component } from "react";

class Group extends Component {
  render() {
    let result = (
      <div>
        <input className="pt-input .modifier" type="text" placeholder="Sarjannimi" dir="auto" />
        <input className="pt-input .modifier" type="text" placeholder="Hinta" dir="auto" />
        <input className="pt-input .modifier" type="text" placeholder="Sarja" dir="auto" />
      </div>
    );
    return result;
  }
}
export default Group;
