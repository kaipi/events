import React, { Component } from "react";
import { Button } from "@blueprintjs/core";

class GroupAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupdata: {
        price_prepay: "",
        price: "",
        racenumberrange_start: "",
        product_code: "",
        distance: "",
        name: "",
        number_prefix: "",
        tagrange_start: "",
        tagrange_end: "",
        racenumberrange_end: ""
      }
    };
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.addNewGroup = this.addNewGroup.bind(this);
  }
  handleGroupChange(evt) {
    let grpdata = Object.assign({}, this.state.groupdata);
    grpdata[evt.target.id] = evt.target.value;
    this.setState({ groupdata: grpdata });
  }
  addNewGroup(id) {
    fetch(process.env.REACT_APP_JYPSAPI + "/api/events/v1/addgroup/" + id, {
      method: "POST",
      body: JSON.stringify(this.state.groupdata),
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jyps-jwt"),
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        this.props.getEventData();
      })
      .catch(error => {
        console.warn(error);
      });
  }
  render() {
    let result = (
      <div className="new-event-group-row">
        <input
          className="pt-input .modifier"
          id="name"
          placeholder="Sarjanimi"
          type="text"
          value={this.state.groupdata.name}
          dir="auto"
          onChange={e => {
            this.handleGroupChange(e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="distance"
          placeholder="Matka"
          value={this.state.groupdata.distance}
          size="5"
          dir="auto"
          onChange={e => {
            this.handleGroupChange(e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="price_prepay"
          placeholder="Hinta"
          value={this.state.groupdata.price_prepay}
          size="5"
          dir="auto"
          onChange={e => {
            this.handleGroupChange(e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="price"
          placeholder="Hinta paikanpäällä"
          value={this.state.groupdata.price}
          size="5"
          dir="auto"
          onChange={e => {
            this.handleGroupChange(e);
          }}
        />

        <input
          className="pt-input .modifier"
          type="text"
          id="product_code"
          placeholder="Sarjakoodi (esim. M30)"
          size="15"
          value={this.state.groupdata.product_code}
          dir="auto"
          onChange={e => {
            this.handleGroupChange(e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="tagrange_start"
          value={this.state.groupdata.tagrange_start}
          placeholder="Tagirange alku"
          size="13"
          dir="auto"
          onChange={e => {
            this.handleGroupChange(e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="tagrange_end"
          placeholder="Tagirange loppu"
          value={this.state.groupdata.tagrange_end}
          size="14"
          dir="auto"
          onChange={e => {
            this.handleGroupChange(e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="number_prefix"
          placeholder="Numero prefixi"
          value={this.state.groupdata.number_prefix}
          size="13"
          dir="auto"
          onChange={e => {
            this.handleGroupChange(e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="racenumberrange_start"
          placeholder="Numerosarja alku"
          value={this.state.groupdata.racenumberrange_start}
          size="15"
          dir="auto"
          onChange={e => {
            this.handleGroupChange(e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="racenumberrange_end"
          placeholder="Numerosarja loppu"
          value={this.state.groupdata.racenumberrange_end}
          size="16"
          dir="auto"
          onChange={e => {
            this.handleGroupChange(e);
          }}
        />
        <Button
          className="app-icon-button"
          onClick={() => {
            this.addNewGroup(this.props.eventId);
          }}
          icon="add"
        />
      </div>
    );
    return result;
  }
}
export default GroupAdd;
