import { useState } from 'react';
import { fetchRandomBreed, fetchRandomImages } from '../services/api';

const RandomBreed = () => {
  const [breed, setBreed] = useState(null);
  const [breedImages, setBreedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch a random breed and its images
  const getRandomBreed = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get a random breed
      const breeds = await fetch('https://dog.ceo/api/breeds/list/all')
        .then(response => response.json())
        .then(data => Object.keys(data.message));
      
      const randomIndex = Math.floor(Math.random() * breeds.length);
      const randomBreed = breeds[randomIndex];
      setBreed(randomBreed);
      
      // Get 3 random images for this breed
      const images = await fetch(`https://dog.ceo/api/breed/${randomBreed}/images/random/3`)
        .then(response => response.json())
        .then(data => data.message);
      
      setBreedImages(images);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch random breed');
      console.error('Error fetching random breed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Display info about the breed from a custom list
  const getBreedInfo = (breed) => {
    // Simple breed information lookup
    const breedInfo = {
      affenpinscher: {
        size: 'Small',
        temperament: 'Confident, Curious, Stubborn',
        lifespan: '12-14 years',
        description: 'The Affenpinscher is a small but feisty dog with a wiry coat.'
      },
      beagle: {
        size: 'Medium',
        temperament: 'Curious, Merry, Friendly',
        lifespan: '10-15 years',
        description: 'The Beagle is a scent hound with an excellent sense of smell.'
      },
      corgi: {
        size: 'Small',
        temperament: 'Affectionate, Smart, Alert',
        lifespan: '12-15 years',
        description: 'Corgis are herding dogs known for their short legs and long bodies.'
      },
      husky: {
        size: 'Medium to Large',
        temperament: 'Outgoing, Friendly, Intelligent',
        lifespan: '12-14 years',
        description: 'Siberian Huskies are known for their endurance and wolf-like appearance.'
      },
    };
    
    // Return generic info if specific breed not found
    const defaultInfo = {
      size: 'Varies',
      temperament: 'Each breed has unique traits',
      lifespan: '10-15 years on average',
      description: 'Dogs are wonderful companions known for their loyalty and affection.'
    };
    
    return breedInfo[breed] || defaultInfo;
  };

  return (
    <div className="random-breed-container">
      <h2>Random Breed Explorer</h2>
      
      <button 
        className="random-breed-button"
        onClick={getRandomBreed} 
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Show Random Breed'}
      </button>
      
      {error && <div className="error-message">{error}</div>}
      
      {breed && !isLoading && (
        <div className="breed-display">
          <h3 className="breed-name">{breed}</h3>
          
          <div className="breed-content">
            <div className="breed-info">
              <h4>Breed Information</h4>
              <div className="info-card">
                {Object.entries(getBreedInfo(breed)).map(([key, value]) => (
                  <div key={key} className="info-item">
                    <span className="info-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                    <span className="info-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="breed-images">
              {breedImages.map((image, index) => (
                <div key={index} className="image-card">
                  <img src={image} alt={`${breed} ${index + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomBreed;
