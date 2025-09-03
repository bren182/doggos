import React from 'react';

/**
 * A reusable component for displaying dog breed statistics with visual indicators
 * @param {Object} props.breedInfo - The breed information object from the API
 */
const BreedStats = ({ breedInfo }) => {
  if (!breedInfo) return null;

  // Define the attributes to display with proper labels
  const ratingAttributes = [
    { key: 'good_with_children', label: 'Good with Children' },
    { key: 'good_with_other_dogs', label: 'Good with Other Dogs' },
    { key: 'good_with_strangers', label: 'Good with Strangers' },
    { key: 'playfulness', label: 'Playfulness' },
    { key: 'energy', label: 'Energy Level' },
    { key: 'trainability', label: 'Trainability' },
    { key: 'protectiveness', label: 'Protectiveness' },
    { key: 'barking', label: 'Barking Tendency' },
    { key: 'shedding', label: 'Shedding Level' },
    { key: 'grooming', label: 'Grooming Needs' },
    { key: 'drooling', label: 'Drooling Level' }
  ];

  // Group physical attributes
  const physicalStats = {
    height: {
      male: `${breedInfo.min_height_male || '?'} - ${breedInfo.max_height_male || '?'} inches`,
      female: `${breedInfo.min_height_female || '?'} - ${breedInfo.max_height_female || '?'} inches`
    },
    weight: {
      male: `${breedInfo.min_weight_male || '?'} - ${breedInfo.max_weight_male || '?'} lbs`,
      female: `${breedInfo.min_weight_female || '?'} - ${breedInfo.max_weight_female || '?'} lbs`
    },
    lifespan: `${breedInfo.min_life_expectancy || '?'} - ${breedInfo.max_life_expectancy || '?'} years`,
    coat_length: breedInfo.coat_length
  };

  // Convert coat length from number to text description
  const coatLengthMap = {
    0: 'Hairless',
    1: 'Short',
    2: 'Medium',
    3: 'Long',
    4: 'Very Long'
  };

  // Helper function to render star ratings
  const renderRating = (rating, max = 5) => {
    if (rating === undefined || rating === null) return 'N/A';
    
    return (
      <div className="star-rating">
        {[...Array(max)].map((_, i) => (
          <span 
            key={i} 
            className={`star ${i < rating ? 'filled' : 'empty'}`}
          >
            ★
          </span>
        ))}
        <span className="rating-number">{rating}/{max}</span>
      </div>
    );
  };

  return (
    <div className="breed-stats">
      <div className="stats-section">
        <h4>Physical Characteristics</h4>
        <div className="physical-stats">
          <div className="stat-item">
            <span className="stat-label">Height (Male):</span>
            <span className="stat-value">{physicalStats.height.male}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Height (Female):</span>
            <span className="stat-value">{physicalStats.height.female}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Weight (Male):</span>
            <span className="stat-value">{physicalStats.weight.male}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Weight (Female):</span>
            <span className="stat-value">{physicalStats.weight.female}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Life Expectancy:</span>
            <span className="stat-value">{physicalStats.lifespan}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Coat Length:</span>
            <span className="stat-value">{coatLengthMap[physicalStats.coat_length] || 'Unknown'}</span>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h4>Temperament & Characteristics</h4>
        <div className="rating-stats">
          {ratingAttributes.map(attr => (
            breedInfo[attr.key] !== undefined && (
              <div key={attr.key} className="rating-item">
                <span className="rating-label">{attr.label}:</span>
                <div className="rating-value">
                  {renderRating(breedInfo[attr.key])}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreedStats;
