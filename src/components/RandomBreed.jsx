import { useState } from 'react';
import { fetchRandomBreed, fetchRandomImages, fetchBreedInfo } from '../services/api';
import BreedStats from './BreedStats';
import './BreedStats.css';

const RandomBreed = () => {
  const [breed, setBreed] = useState(null);
  const [breedImages, setBreedImages] = useState([]);
  const [breedInfo, setBreedInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch a random breed and its images
  const getRandomBreed = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get a random breed using our API service
      const randomBreed = await fetchRandomBreed();
      setBreed(randomBreed);
      
      // Get images for this breed
      const images = await fetchRandomImages(randomBreed, 3);
      setBreedImages(images);
      
      // Get breed information from API
      const info = await fetchBreedInfo(randomBreed);
      setBreedInfo(info);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch random breed');
      console.error('Error fetching random breed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Format breed information for display
  const formatBreedInfo = (info) => {
    if (!info) return {};
    
    return {
      size: `${info.min_height_male || '?'} to ${info.max_height_male || '?'} inches`,
      weight: `${info.min_weight_male || '?'} to ${info.max_weight_male || '?'} pounds`,
      lifespan: `${info.min_life_expectancy || '?'} to ${info.max_life_expectancy || '?'} years`,
      temperament: info.temperament || 'Information not available',
      energy: `${info.energy || '?'}/5`,
      trainability: `${info.trainability || '?'}/5`,
      protectiveness: `${info.protectiveness || '?'}/5`,
      shedding: `${info.shedding || '?'}/5`
    };
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
              {breedInfo && (
                <>
                  <div className="info-card summary">
                    {Object.entries(formatBreedInfo(breedInfo)).map(([key, value]) => (
                      <div key={key} className="info-item">
                        <span className="info-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                        <span className="info-value">{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <BreedStats breedInfo={breedInfo} />
                </>
              )}
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
