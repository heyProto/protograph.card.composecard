import React from 'react';
import { all as axiosAll, get as axiosGet, spread as axiosSpread } from 'axios';

export default class toCard extends React.Component {

  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      siteConfigs: this.props.siteConfigs
    };
    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
      // stateVar.languageTexts = this.getLanguageTexts(this.props.dataJSON.data.language);
    }

    this.state = stateVar;
  }

  exportData() {
    return document.getElementById('toCard_card').getBoundingClientRect();
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
          optionalConfigJSON:{},
          siteConfigs: site_configs ? site_configs.data : this.state.siteConfigs
        };

        // stateVar.dataJSON.data.language = stateVar.siteConfigs.primary_language.toLowerCase();
        // stateVar.languageTexts = this.getLanguageTexts(stateVar.dataJSON.data.language);
        this.setState(stateVar);
      }));
    } else {
      this.componentDidUpdate();
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON
      });
    }
  }

  getLanguageTexts(languageConfig) {
    let language = languageConfig ? languageConfig : "hindi",
      text_obj;

    switch(language.toLowerCase()) {
      case "hindi":
        text_obj = {
          font: "'Sarala', sans-serif"
        }
        break;
      default:
        text_obj = {
          font: undefined
        }
        break;
    }

    return text_obj;
  }


  render() {
    /*
      Code the CARD UI
      Ensure that you break down the UI into multiple smaller components /functions that can be reused.
    */
    if (this.state.fetchingData) {
      return (<div>Loading</div>)
    } else {

      let text = this.state.dataJSON.data.text;
      return (
        <div className="compose-card" dangerouslySetInnerHTML={{ __html: text }}>
        </div>
      );
    }
  }
}
