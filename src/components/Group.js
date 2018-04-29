import React, { Component } from "react";
import { Button } from "@blueprintjs/core";

class Group extends Component {
  render() {
    let result = (
      <div className="new-event-group-row">
        <input
          className="pt-input .modifier"
          id="name"
          type="text"
          placeholder="Sarjannimi"
          dir="auto"
          onChange={e => {
            this.props.handleGroupChange(this.props.id, e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="distance"
          placeholder="Matka"
          size="5"
          dir="auto"
          onChange={e => {
            this.props.handleGroupChange(this.props.id, e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="price_prepay"
          placeholder="Hinta"
          size="5"
          dir="auto"
          onChange={e => {
            this.props.handleGroupChange(this.props.id, e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="price"
          placeholder="Hinta paikanpäällä"
          size="5"
          dir="auto"
          onChange={e => {
            this.props.handleGroupChange(this.props.id, e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="product_code"
          placeholder="Sarjakoodi (esim. M30)"
          size="15"
          dir="auto"
          onChange={e => {
            this.props.handleGroupChange(this.props.id, e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="tagrange_start"
          placeholder="Tagirange alku"
          size="13"
          dir="auto"
          onChange={e => {
            this.props.handleGroupChange(this.props.id, e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="tagrange_end"
          placeholder="Tagirange loppu"
          size="14"
          dir="auto"
          onChange={e => {
            this.props.handleGroupChange(this.props.id, e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="number_prefix"
          placeholder="Numero prefixi"
          size="13"
          dir="auto"
          onChange={e => {
            this.props.handleGroupChange(this.props.id, e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="racenumberrange_start"
          placeholder="Numerosarja alku"
          size="15"
          dir="auto"
          onChange={e => {
            this.props.handleGroupChange(this.props.id, e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="racenumberrange_end"
          placeholder="Numerosarja loppu"
          size="16"
          dir="auto"
          onChange={e => {
            this.props.handleGroupChange(this.props.id, e);
          }}
        />
        <Button
          className="app-icon-button"
          onClick={() => {
            this.props.removeGroup(this.props.id);
          }}
          icon="trash"
        />
      </div>
    );
    return result;
  }
}
export default Group;
