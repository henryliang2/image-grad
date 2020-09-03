import React from 'react';
import FadeIn from 'react-fade-in';
import '../App.css';
import './ModelDescription.css'

const ModelDescription = (props) => {

  if (props.model !==  'pca' && props.model !== 'kmeans') {
    return ''
  } else {

    const descObject = (props.model === 'pca')

      ? { 
          description: `Principal Component Analysis (PCA) is a technique that reduces the dimensionality 
            of data while retaining the maximum amount of information possible. In 
            this case, the model reduces the three color dimensions of Hue (H), Saturation (S), 
            and Brightness (V) down to a single dimension. This allows comparison and sorting of 
            the primary HSV values of images in one-dimensional space.`,
          creditUrl: 'https://stats.stackexchange.com/q/140579',
          creditTitle: '"Amoeba", stats.stackexchange.com'
        }
      
      : 
      {
        description: `K-Means Clustering is an algorithm that attempts to accurately group the data into 
          a specified number (K) of clusters, with each cluster of data described by their 
          centroid (the "mean"). The algorithm accomplishes this by assigning each data point 
          to a cluster, determining where the centroid of that cluster should go, and then 
          repeating this cycle again. In this way, the algorithm approaches the solution in 
          an iterative matter. Because of the semi-random way the clusters are initialized, 
          you may get a different result each time you run the algorithm!`,
        creditUrl: 'https://commons.wikimedia.org/wiki/File:K-means_convergence.gif',
        creditTitle: 'Chire / CC BY-SA '
      }

    return (
      <React.Fragment>
        <div className='title-container'>
          <h1>Description</h1>
        </div>
        <FadeIn>
          <div className={`model-image model-image-${props.model}`}>
            <a href={ descObject.creditUrl }
              target='_blank'
              rel='noopener noreferrer'>{ descObject.creditTitle }</a>
          </div>
          <p className='model-description-text'>{ descObject.description }</p>
        </FadeIn>
      </React.Fragment>
    );
  }

}

export default ModelDescription
