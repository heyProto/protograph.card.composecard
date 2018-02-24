import React from 'react';
import ReactDOM from 'react-dom';
import Card from './src/js/card.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};


ProtoGraph.Card.ComposeCard = function () {
  this.cardType = 'ComposeCard';
}

ProtoGraph.Card.ComposeCard.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.ComposeCard.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.ComposeCard.prototype.renderCol7 = function (data) {
  this.mode = 'col7';
  this.render();
}
ProtoGraph.Card.ComposeCard.prototype.renderCol4 = function (data) {
  this.mode = 'col4';
  this.render();
}

ProtoGraph.Card.ComposeCard.prototype.render = function () {
  ReactDOM.render(
    <Card
      selector={this.options.selector}
      dataURL={this.options.data_url}
      siteConfigs={this.options.site_configs}
      siteConfigURL={this.options.site_config_url}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }} />,
    this.options.selector);
}

