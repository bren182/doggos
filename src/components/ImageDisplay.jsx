import React from 'react';

function ImageDisplay({ breedImages, isLoading, error, selectedBreed }) {
  if (!selectedBreed) {
    return <div className="select-breed-message">Select a breed to see images</div>;
  }

  if (isLoading) {
    return <div className="loading">Loading images for {selectedBreed}...</div>;
  }

  if (error) {
    return <div className="error">Error loading images: {error}</div>;
  }

  return (
    <div className="image-display">
      <h4>Images</h4>
      <div className="image-container">
        {breedImages && breedImages.length > 0 ? (
          breedImages.map((imageUrl, index) => (
            <div key={index} className="image-card">
              <img src={imageUrl} alt={`${selectedBreed} ${index + 1}`} />
            </div>
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>
    </div>
  );
}

export default ImageDisplay;
