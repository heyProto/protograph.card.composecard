import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class composeCard extends React.Component {
  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      schemaJSON: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined,
      languageTexts: undefined,
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

    if (this.props.optionalConfigSchemaJSON) {
      stateVar.optionalConfigSchemaJSON = this.props.optionalConfigSchemaJSON;
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
      axios.all([
        axios.get(this.props.dataURL),
        axios.get(this.props.optionalConfigURL),
        axios.get(this.props.optionalConfigSchemaURL)
      ])
      .then(axios.spread((card, opt_config, opt_config_schema) => {
        this.setState({
          fetchingData: false,
          dataJSON: card.data,
          optionalConfigJSON: opt_config.data,
          optionalConfigSchemaJSON: opt_config_schema.data,
          text:card.data.data.text
        });
      }));
    } else {
      // this.componentDidUpdate();
    }
  }

  // componentWillReceiveProps(nextProps) {
  //     this.setState({
  //       text: nextProps.text
  //     });
  // }


  // componentDidUpdate() {
  // }

 

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
