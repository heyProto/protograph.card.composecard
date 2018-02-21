import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class composeCard extends React.Component {
  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      optionalConfigJSON: {},
      content: undefined,
      editable: false,
      text: undefined
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }

    if(this.props.text){
      stateVar.text = this.props.text;
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    if(this.props.editable){
      stateVar.editable=this.props.editable;
    }

    this.state = stateVar;
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  componentDidMount() {
    if (this.state.fetchingData) {
      let items_to_fetch = [
        axios.get(this.props.dataURL),
        axios.get(this.props.optionalConfigURL)
      ];

      if (this.props.siteConfigURL) {
        items_to_fetch.push(axios.get(this.props.siteConfigURL));
      }

      axios.all(items_to_fetch).then(axios.spread((card, opt_config, site_configs) => {
        let stateVar = {
          fetchingData: false,
          dataJSON: card.data,
          optionalConfigJSON: opt_config.data,
          text: card.data.data.text
        };

        site_configs ? stateVar["siteConfigs"] = site_configs.data : stateVar["siteConfigs"] = this.state.siteConfigs;
        this.setState(stateVar);
      }));
    }
  }

  renderCol7() {
    if (this.state.fetchingData ){
      return(<div>Loading</div>)
    } else {

      return (
        <div className="protograph-col7-mode proto-compose-card" dangerouslySetInnerHTML={{__html: this.state.text}}>
        </div>
      )
    }
  }
  renderCol4() {
    if (this.state.fetchingData ){
      return(<div>Loading</div>)
    } else {
      return (
        <div className="protograph-col4-mode proto-compose-card" dangerouslySetInnerHTML={{__html: this.state.text}}>
        </div>
      )
    }
  }

  render() {
    switch(this.props.mode) {
      case 'col7' :
        return this.renderCol7();
        break;
      case 'col4':
        return this.renderCol4();
        break;
    }
  }
}
