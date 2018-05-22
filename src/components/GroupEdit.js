import React, { Component } from "react";
import { Button } from "@blueprintjs/core";

class GroupEdit extends Component {
  render() {
    let result = (
      <div className="new-event-group-row">
        <input
          className="pt-input .modifier"
          id="name"
          type="text"
          value={this.props.groupdata.name}
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
          value={this.props.groupdata.distance}
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
          value={this.props.groupdata.price_prepay}
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
          value={this.props.groupdata.price}
          size="5"
          dir="auto"
          onChange={e => {
            this.props.handleGroupChange(this.props.id, e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="discount"
          placeholder="Alennus euroina"
          value={this.props.groupdata.discount}
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
          value={this.props.groupdata.product_code}
          dir="auto"
          onChange={e => {
            this.props.handleGroupChange(this.props.id, e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="tagrange_start"
          value={this.props.groupdata.tagrange_start}
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
          value={this.props.groupdata.tagrange_end}
          size="14"
          dir="auto"
          onChange={e => {
            this.props.handleGroupChange(this.props.id, e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="current_tag"
          placeholder="Tämänhetkinen tagi"
          value={this.props.groupdata.current_tag}
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
          value={this.props.groupdata.number_prefix}
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
          value={this.props.groupdata.racenumberrange_start}
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
          value={this.props.groupdata.racenumberrange_end}
          size="16"
          dir="auto"
          onChange={e => {
            this.props.handleGroupChange(this.props.id, e);
          }}
        />
        <input
          className="pt-input .modifier"
          type="text"
          id="current_racenumber"
          placeholder="Tämänhetkinen tagi"
          value={this.props.groupdata.current_racenumber}
          size="14"
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
export default GroupEdit;
