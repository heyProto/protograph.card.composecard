import React from 'react';
import { render, hydrate } from 'react-dom';
import Card from './src/js/card.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};

ProtoGraph.Card.toComposeCard = function () {
  this.cardType = 'Card';
}

ProtoGraph.Card.toComposeCard.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.toComposeCard.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toComposeCard.prototype.render = function () {
  if (this.options.isFromSSR) {
    hydrate(
      <Card
        dataJSON={this.options.data_url}
      />,
      this.options.selector);
  } else {
    render(
      <Card
        dataURL={this.options.data_url}
        schemaURL={this.options.schema_url}
        siteConfigs={this.options.site_configs}
        siteConfigURL={this.options.site_config_url}
        ref={(e) => {
          this.containerInstance = this.containerInstance || e;
        }}
      />,
      this.options.selector);
  }
}

