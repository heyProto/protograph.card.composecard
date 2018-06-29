import React from 'react';
import { all as axiosAll, get as axiosGet, spread as axiosSpread } from 'axios';
import Card from './card.jsx';
// import JSONSchemaForm from '../../lib/js/react-jsonschema-form';
import Editor from 'react-medium-editor';
require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/default.css');
import CustomHTML from 'medium-editor-custom-html';

export default class editCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      dataJSON: {},
      publishing: false,
      schemaJSON: undefined,
      fetchingData: true,
      uiSchemaJSON: {}
    }
  }

  exportData() {
    let getDataObj = {
      step: this.state.step,
      dataJSON: this.state.dataJSON,
      schemaJSON: this.state.schemaJSON,
      optionalConfigJSON: this.state.optionalConfigJSON,
      optionalConfigSchemaJSON: this.state.optionalConfigSchemaJSON
    }
    getDataObj["name"] = getDataObj.dataJSON.data.title.substr(0,225); // Reduces the name to ensure the slug does not get too long
    return getDataObj;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object.
    if (this.state.fetchingData){
      axiosAll([
        axiosGet(this.props.dataURL),
        axiosGet(this.props.schemaURL),
        axiosGet(this.props.uiSchemaURL)
      ])
        .then(axiosSpread((card, schema, uiSchema) => {
        let stateVars = {
          fetchingData: false,
          dataJSON: card.data,
          schemaJSON: schema.data,
          uiSchemaJSON: uiSchema.data,
          text:card.data.data.text
        };
        // console.log(card.data)
        this.setState(stateVars);
      }));
    }
  }

  onChangeHandler({formData}) {
    // switch (this.state.step) {
    //   case 1:
        // console.log(formData)
        this.setState((prevStep, prop) => {
          // Manipulate dataJSON
          let text = this.prevStep.text;
          text = formData;
          return {
            text:text 
          }
        })
    //     break;
    //   case 2:
    //     this.setState((prevState, prop) => {
    //       // Manipulate dataJSON
    //       return {
    //         dataJSON: dataJSON
    //       }
    //     })
    //     break;
    // }
  }

  onSubmitHandler({formData}) {
    
      if (typeof this.props.onPublishCallback === "function") {
        let dataJSON = this.state.dataJSON;
        dataJSON.data.section = dataJSON.data.title;
        this.setState({ publishing: true, dataJSON: dataJSON });
        let publishCallback = this.props.onPublishCallback();
        publishCallback.then((message) => {
          this.setState({ publishing: false });
        });
      }

  
  }

  renderEditor() {
    let options = {
      toolbar: {
        buttons: ['bold', 'h2', 'h3', 'quote', 'anchor', 'unorderedlist', 'orderedlist', 'divider']
      },
      extensions: {
        "divider": new CustomHtml({
          buttonText: "Divider",
          htmlToInsert: "<hr class='divider'>"
        })
      }
    };

    return (<Editor
      text={this.state.text}
      onChange={(e) => { this.onChangeHandler(e) }}
      options={options}
    />)
  }


  renderSEO() {
    let d = this.state.dataJSON.data;

    let blockquote_string = `<h1>${d.title}</h1>`;
    // Create blockqoute string.
    let seo_blockquote = '<blockquote>' + blockquote_string + '</blockquote>'
    return seo_blockquote;
  }

  // renderSchemaJSON() {
  //   let schema;
  //   switch(this.state.step){
  //     case 1:
  //       return this.state.schemaJSON.properties.data;
  //       break;
  //     // Add more schemas...
  //   }
  // }

  // renderFormData() {
  //   switch(this.state.step) {
  //     case 1:
  //       return this.state.dataJSON.data;
  //       break;
  //     // Other form data.
  //   }
  // }

  // showLinkText() {
  //   switch(this.state.step) {
  //     case 1:
  //       return '';
  //       break;
  //     case 2:
  //       return '< Back';
  //       break;
  //   }
  // }

  // showButtonText() {
    
  //       return 'Publish';
    
  // }

  // getUISchemaJSON() {
    
  //   // console.log(this.state.uiSchemaJSON)
  //   return this.state.uiSchemaJSON.data;

  // }

  // onPrevHandler() {
  //   let prev_step = --this.state.step;
  //   this.setState({
  //     step: prev_step
  //   });
  // }

  render() {
    if (this.state.fetchingData) {
      return(<div>Loading</div>)
    } else {
      return (  
        <div className="proto-container">
          {this.renderEditor()}

          <br />
          <button
            type="submit"
            className={`${this.state.publishing ? 'ui primary loading disabled button' : ''} default-button protograph-primary-button`}
            onClick={this.onSubmitHandler}
          >Publish</button>
              
        </div>
      )
    }
  }
}
