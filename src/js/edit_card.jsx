import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Card from './card.jsx';
import JSONSchemaForm from '../../lib/js/react-jsonschema-form';

export default class editComposeCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      dataJSON: {},
      mode: "col7",
      publishing: false,
      schemaJSON: undefined,
      fetchingData: true,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined,
      uiSchemaJSON: {},
      content: undefined
    }
    // this.refLinkSourcesURL = window.ref_link_sources_url
    this.toggleMode = this.toggleMode.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    // this.formValidator = this.formValidator.bind(this);
  }

  exportData() {
    let getDataObj = {
      step: this.state.step,
      dataJSON: this.state.dataJSON,
      schemaJSON: this.state.schemaJSON,
      optionalConfigJSON: this.state.optionalConfigJSON,
      optionalConfigSchemaJSON: this.state.optionalConfigSchemaJSON
    }
    getDataObj["name"] = this.state.title.substr(0,225); // Reduces the name to ensure the slug does not get too long
    return getDataObj;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object.
    if (this.state.fetchingData){
      axios.all([
        axios.get(this.props.dataURL),
        axios.get(this.props.schemaURL),
        axios.get(this.props.optionalConfigURL),
        axios.get(this.props.optionalConfigSchemaURL),
        axios.get(this.props.uiSchemaURL),
      ])
      .then(axios.spread((card, schema, opt_config, opt_config_schema, uiSchema) => {
        let stateVars = {
          fetchingData: false,
          dataJSON: card.data,
          schemaJSON: schema.data,
          optionalConfigJSON: opt_config.data,
          optionalConfigSchemaJSON: opt_config_schema.data,
          uiSchemaJSON: uiSchema.data,
          text:card.data.text
        }
        this.setState(stateVars);
      }));
    }
  }


  // onChangeHandler({formData}) {
  //   switch (this.state.step) {
  //     case 1:
  //       this.setState((prevStep, prop) => {
  //         let dataJSON = prevStep.dataJSON;
  //         dataJSON.data = formData;
  //         return {
  //           dataJSON: dataJSON
  //         }
  //       })
  //       break;
  //   }
  // }

  // onSubmitHandler({formData}) {
  //   switch(this.state.step) {
  //     case 1:
  //       if (typeof this.props.onPublishCallback === "function") {
  //         this.setState({ publishing: true });
  //         let publishCallback = this.props.onPublishCallback();
  //         publishCallback.then((message) => {
  //           this.setState({ publishing: false });
  //         });
  //       }
  //   }
  // }

  onSubmitHandler(e) {
    if (typeof this.props.onPublishCallback === "function") {
      let publishCallback,
        data = this.cardInstance.getData();

      this.setState({
        publishing: true,
        dataJSON: data.dataJSON,
        title: data.title
      }, (f) => {
        publishCallback = this.props.onPublishCallback();
        publishCallback.then((message) => {
          this.setState({ publishing: false });
        });
      });
    }
  }

  renderSEO() {
    let seo_blockquote = '<blockquote>' + this.state.dataJSON.data.text + '</blockquote>'
    return seo_blockquote;
  }

  // renderSchemaJSON() {
  //   let schema;
  //   switch(this.state.step){
  //     case 1:
  //       return this.state.schemaJSON.properties.data;
  //       break;
  //   }
  // }

  // renderFormData() {
  //   switch(this.state.step) {
  //     case 1:
  //       return this.state.dataJSON.data;
  //       break;
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
  //   switch(this.state.step) {
  //     case 1:
  //       return 'Next';
  //       break;
  //     case 2:
  //       return 'Publish';
  //       break;
  //   }
  // }

  // getUISchemaJSON() {
  //   switch (this.state.step) {
  //     case 1:
  //       return this.state.uiSchemaJSON.section1.data;
  //       break;
  //     case 2:
  //       return this.state.uiSchemaJSON.section2.data;
  //       break;
  //     default:
  //       return {};
  //       break;
  //   }
  // }

  onPrevHandler() {
    let prev_step = --this.state.step;
    this.setState({
      step: prev_step
    });
  }

  toggleMode(e) {
    let element = e.target.closest('a'),
      mode = element.getAttribute('data-mode');

    this.setState((prevState, props) => {
      let newMode;
      if (mode !== prevState.mode) {
        newMode = mode;
      } else {
        newMode = prevState.mode
      }

      return {
        mode: newMode
      }
    })
  }

  render() {
    if (this.state.fetchingData) {
      return(<div>Loading</div>)
    } else {
      return (
        <div className="proto-container">
          <div className="ui grid form-layout">
            <div className="row">
              <div className="sixteen wide column proto-card-preview proto-share-card-div">
                <div className="protograph-menu-container">
                  <div className="ui compact menu">
                    <a className={`item ${this.state.mode === 'col7' ? 'active' : ''}`}
                      data-mode='col7'
                      onClick={this.toggleMode}
                    >
                      col-7
                    </a>
                    <a className={`item ${this.state.mode === 'col4' ? 'active' : ''}`}
                      data-mode='col4'
                      onClick={this.toggleMode}
                    >
                      col-4
                    </a>
                  </div>
                </div>
                <div className="protograph-app-holder">
                  <Card
                    mode={this.state.mode}
                    text={this.state.dataJSON.data.text}
                    dataJSON={this.state.dataJSON}
                    schemaJSON={this.state.schemaJSON}
                    editable={true}
                    optionalConfigJSON={this.state.optionalConfigJSON}
                    optionalConfigSchemaJSON={this.state.optionalConfigSchemaJSON}
                    content={this.state.content}
                    ref={(instance) => this.cardInstance = instance }
                  />
                  <br />
                  <button
                    type="submit"
                    className={`${this.state.publishing ? 'ui primary loading disabled button' : ''} default-button protograph-primary-button`}
                    onClick={this.onSubmitHandler}
                  >Publish</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
