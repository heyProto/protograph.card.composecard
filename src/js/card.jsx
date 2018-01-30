import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';


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
    this.getData = this.getData.bind(this);
    this.state = stateVar;
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  componentDidMount() {
    if(this.props.editable){
      $('.medium-editor-action-anchor').prepend('<img id="link_image" src="https://cdn.protograph.pykih.com/Assets/compose-card/link.png" />')
    }
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

  getData() {
    let h2 = document.querySelector('.proto-compose-card h2'),
      h3 = document.querySelector('.proto-compose-card h3'),
      p = document.querySelector('.proto-compose-card p'),
      title;

    if (h2) {
      title = h2.innerHTML;
    } else if (h3) {
      title = h3.innerHTML;
    } else if (p) {
      title = p.innerHTML;
    } else {
      title = (+new Date()).toString();
    }

    return {
      dataJSON: this.state.dataJSON,
      title: title
    };
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
