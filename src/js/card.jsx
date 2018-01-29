import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
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
    if(this.props.editable){
      $('.medium-editor-action-anchor').prepend('<img id="link_image" src="./src/images/link.png" />')
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
      this.componentDidUpdate();
    }
  }

  componentWillReceiveProps(nextProps) {
      this.setState({
        text: nextProps.text
      });
  }

  handleChange(dat){
    let that = this;
    let html = $.parseHTML(dat);
    let dataJSON = this.state.dataJSON;
    let data = this.state.dataJSON.data;
    data.text = dat
    let hdata={};
    let nav = []
    let count = 0;
    let check = $(html).toArray().length - 1;
    $(html).each(function(index){
      if($(this).next().is('h2') || index === check){
        nav.push(hdata);
      }
      if($(this).is('h2') ){
        hdata = {};
        hdata["heading"]=$(this).html();
        hdata["subheading"]=[];
        console.log(check);
      }
      
      if($(this).is('h3')){
        let hdata2 = {};
        count+=1;
        hdata2["heading"]=$(this).html();
        hdata.subheading.push(hdata2)
      }
    });
    data.navigation = nav;
    dataJSON.data = data;
    console.log(data);
    this.setState({
      text:dat,
      dataJSON: dataJSON
    })
  }
  componentDidUpdate() {

  }
  renderCol7() {
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
              'bold','h2','h3',
              'quote',
              'anchor','unorderedlist','orderedlist','divider'
          ]}, extensions: {
            "divider": new CustomHtml({
                buttonText: "Divider"
              , htmlToInsert: "<hr class='divider'>"
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
              'h2','h3',
              'quote',
              'anchor','unorderedlist','orderedlist',
              'divider'
          ]}, extensions: {
            "divider": new CustomHtml({
                buttonText: "Divider"
              , htmlToInsert: "<hr class='divider'>"
            })
        }}}
          />
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
