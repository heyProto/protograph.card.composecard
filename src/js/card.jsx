import React from 'react';
import ReactDOM from 'react-dom';
import { all as axiosAll, get as axiosGet, spread as axiosSpread } from 'axios';

export default class composeCard extends React.Component {
  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
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
        axiosGet(this.props.dataURL)
      ];

      if (this.props.siteConfigURL) {
        items_to_fetch.push(axiosGet(this.props.siteConfigURL));
      }

      axiosAll(items_to_fetch).then(axiosSpread((card, site_configs) => {
        let stateVar = {
          fetchingData: false,
          dataJSON: card.data,
          text: card.data.data.text,
          siteConfigs: site_configs ? site_configs.data : this.state.siteConfigs
        };
        this.setState(stateVar);
      }));
    }else{
      this.componentDidUpdate();
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
