import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import TimeAgo from 'react-timeago';
import ReactMarkdown from 'react-markdown';
import Editor from 'react-medium-editor';
require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/default.css');
import CustomHTML from 'medium-editor-custom-html';
export default class toCluster extends React.Component {

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
      stateVar.languageTexts = this.getLanguageTexts(this.props.dataJSON.data.language);
    }

    if(this.props.content){
      stateVar.content = this.props.content;
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
    this.processLink = this.processLink.bind(this);
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }
  handleEditorChange(e) {
    console.log(e.target.getContent());
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
          languageTexts: this.getLanguageTexts(card.data.data.language)
        });
      }));
    } else {
      this.componentDidUpdate();
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        content: nextProps.content
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
  handleChange(data){
    this.setState({
      content:data
    })
  }
  componentDidUpdate() {
    let data = this.state.dataJSON.data;
  }
  renderCol7() {
    let data = this.state.dataJSON.data;
    if (this.state.fetchingData ){
      return(<div>Loading</div>)
    } else {
        return (
          <div className="protograph-col7-mode">
            <Editor
            tag="pre"
            text={this.state.text}
            onChange={(e)=>{this.handleChange(e)}}
            options={{disableEditing:!this.state.editable,toolbar: !this.state.editable ? false :{buttons: [
              'bold',
              'italic',
              'h1','h2','h3',
              'justifyCenter',
              'quote',
              'anchor','unorderedlist','orderedlist','divider'
          ]}, extensions: {
            "divider": new CustomHtml({
                buttonText: "<hr>"
              , htmlToInsert: "<hr class='someclass'>"
            })
        }}}
          />
          </div>
        )
    }
  }
  renderCol4() {
    let data = this.state.dataJSON.data;
    if (this.state.fetchingData ){
      return(<div>Loading</div>)
    } else {
        return (
          <div className="protograph-col4-mode">
            <Editor
            tag="pre"
            text={this.state.text}
            onChange={(e)=>{this.handleChange(e)}}
            options={{disableEditing:!this.state.editable,toolbar: !this.state.editable ? false :{buttons: [
              'bold',
              'italic',
              'h1','h2','h3',
              'justifyCenter',
              'quote',
              'anchor',
              'divider'
          ]}, extensions: {
            "divider": new CustomHtml({
                buttonText: "<hr>"
              , htmlToInsert: "<hr class='someclass'>"
            })
        }}}
          />
          </div>
        )
    }
  }
  processLink(e) {
    const links = this.state.dataJSON.data.links;
    switch (e.type) {
      case 'linkReference':
        let linkRef = +e.identifier;
        e.type = "link";
        e.title = null;
        if ((linkRef - 1) < links.length ) {
          e.url = this.state.dataJSON.data.links[+e.identifier - 1].link;
          return true;
        } else  {
          e.type = "span"
          return true;
        }
        break;
      // Don't allow any external link. Make all the links to span.
      case 'link':
        e.type = "span"
        return true;
      default:
        return true;
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
