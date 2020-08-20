import './App.css';
import React, { Component } from 'react';
import ImageList            from './ImageList/ImageList';
import MyDropzone           from './Dropzone/Dropzone';
import Graphs               from './Graphs/Graphs'
import ModelDescription     from './ModelDescription/ModelDescription'
const Models = require('./Models/Models.js');
const Clarifai  = require('clarifai');
const tinycolor = require('tinycolor2');

const clarifaiApp = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API_KEY
});

class App extends Component {
  constructor(){
    super();
    this.state = { 
      images: [],
      model: '',
      numOfClusters: 1,
      route: 'input',
      expectedImages: 0
    }
  }

  getState = () => {
    console.log(this.state)
  }

  pushImageToState = (id, url, primaryColor, index) => {
    this.setState(prevState => ({
      images: [...prevState.images, {
        id,                            // unique identifier
        url,                           // url or base64 string of image
        primaryColorHex: primaryColor, // primary color of image in hexidecimal notation
        primaryColorHSV: tinycolor(primaryColor).toHsv(), // primary color of image in HSV notation
        index // analyzed index of HSV color (reduced to one single dimension)
      }]
    }));
  }

  setExpectedImages = (num) => {
    /*
    * Adds expected images that are currently loading to existing
    * expected images. Used for Loading Screen if images.length() 
    * !== expectedImages 
    */
    this.setState(prevState => {
      return { 
        ...prevState, 
        expectedImages: num 
      }
    })
  }

  getPrimaryColor = (clarifaiOutput) => {
    const sortedColors = clarifaiOutput[0].data.colors.sort((a, b) => { 
      return b.value - a.value });
    return sortedColors[0].raw_hex;
  }

  runClarifaiModel = (urls) => {
    const COLOR_MODEL = "eeed0b6733a644cea07cf4c60f87ebb7";
    const outputs = clarifaiApp.models.predict(COLOR_MODEL, urls)
      .then(response => { return response.outputs });
    return outputs
  }

  onRouteChange = () => {
    this.state.route === 'input'
      ? this.setState({ route: 'analysis' })
      : this.setState({ route: 'input' })
  }

  render() {
    /* ----- Input Route ----- */
    if (this.state.route === 'input') {
      return (
        <React.Fragment>
          <div className='container' >
            <div className='drop-column'>

              { /* ----- Dropzone Component ----- */ }
              <MyDropzone 
                runClarifaiModel={this.runClarifaiModel}
                pushImageToState={this.pushImageToState}
                getPrimaryColor={this.getPrimaryColor}
                onRouteChange={this.onRouteChange}
                expectedImages={this.state.expectedImages}
                setExpectedImages={this.setExpectedImages}
                state={this.state}
              />
              <div className='button-list'>
                <button onClick={this.onRouteChange}>Analysis Page</button>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }

    /* ----- Analysis Route ----- */
    else if (this.state.route === 'analysis') {
      return (
        <React.Fragment>
          <div className='container'>
          
            { /* ----- Left Column ----- */ }
            <div className='column left-column'>
              <ImageList 
                runClarifaiModel={this.runClarifaiModel}
                pushImageToState={this.pushImageToState}
                getPrimaryColor={this.getPrimaryColor}
                setExpectedImages={this.setExpectedImages}
                onRouteChange={this.onRouteChange}
                state={this.state}
                />
            </div>

            { /* ----- Right Column ----- */ }
            <div className='column right-column'>

              { /* ----- Graphs Component ----- */ }
              <Graphs state={this.state}/>

              { /* ----- Analysis Buttons ----- */ }
              <div className= 'button-list'>
                <button onClick={() => { 
                  this.setState(Models.runModel('pca', this.state)) 
                }}> Analyze (PCA Model) </button>

                <button onClick={() => { 
                  this.setState(Models.runModel('kmeans', this.state)) 
                }}> Analyze (K-Means Model) </button>

                
              </div>

              <div className='button-list'>
                <button onClick={this.getState}>Log State</button>
              </div>

              { /* ----- ModelDescription Component ----- */ }
              <ModelDescription model={this.state.model}/>

            </div>
          </div>
        </React.Fragment>
      )
    }
  }
}

export default App;
