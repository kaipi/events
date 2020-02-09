import React, { Component } from "react";
import { Button } from "@blueprintjs/core";

class DiscountAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discountdata: {
        discount_amount: "",
        valid_to: "",
        valid_from: ""
      }
    };
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.addNewDiscount = this.addNewDiscount.bind(this);
  }
  handleGroupChange(evt) {
    let discount = Object.assign({}, this.state.discountdata);
    discount[evt.target.id] = evt.target.value;
    this.setState({ discountdata: discount });
  }
  addNewDiscount(id) {
    fetch(
      process.env.REACT_APP_JYPSAPI +
        "/api/events/v1/event/" +
        id +
        "/discount",
      {
        method: "POST",
        body: JSON.stringify(this.state.discountdata),
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jyps-jwt"),
          "Content-Type": "application/json"
        }
      }
    )
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
          className="bp3-input .modifier"
          id="discount_amount"
          placeholder="Alennus määrä (euroa)"
          type="text"
          value={this.state.discountdata.discount_amount}
          dir="auto"
          onChange={e => {
            this.handleGroupChange(e);
          }}
        />
        <input
          className="bp3-input .modifier"
          type="text"
          id="valid_from"
          placeholder="Voimassa alkaen"
          value={this.state.discountdata.valid_from}
          size="5"
          dir="auto"
          onChange={e => {
            this.handleGroupChange(e);
          }}
        />
        <input
          className="bp3-input .modifier"
          type="text"
          id="valid_to"
          placeholder="Voimassa loppuen"
          value={this.state.discountdata.valid_to}
          size="5"
          dir="auto"
          onChange={e => {
            this.handleGroupChange(e);
          }}
        />

        <Button
          className="app-icon-button"
          onClick={() => {
            this.addNewDiscount(this.props.eventId);
          }}
          icon="add"
        />
      </div>
    );
    return result;
  }
}
export default DiscountAdd;
