import React from 'react';
import ReactDOM from 'react-dom';
import EditCard from './src/js/edit_card.jsx';

ProtoGraph.Card.ComposeCard.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.ComposeCard.prototype.renderSEO = function (data) {
  this.renderMode = 'SEO';
  return this.containerInstance.renderSEO();
}

ProtoGraph.Card.ComposeCard.prototype.renderEdit = function (onPublishCallback) {
  this.mode = 'edit';
  this.onPublishCallback = onPublishCallback;
  ReactDOM.render(
    <EditCard
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      uiSchemaURL={this.options.ui_schema_url}
      onPublishCallback={this.onPublishCallback}
      siteConfigURL={this.options.site_config_url}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}
