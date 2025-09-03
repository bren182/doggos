import { useState, useEffect } from 'react';
import { fetchBreedInfo, fetchRandomImages } from '../services/api';
import './BreedList.css';

function BreedList({ breeds, isLoading, error, onBreedSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [breedPreviews, setBreedPreviews] = useState({});
  const [expandedBreed, setExpandedBreed] = useState(null);
  const [loadingPreviews, setLoadingPreviews] = useState(false);
  const [showBreedList, setShowBreedList] = useState(true);

  // Filter breeds based on search term
  const filteredBreeds = breeds.filter((breed) => 
    breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle breed selection
  const handleBreedSelect = (breed) => {
    onBreedSelect(breed);
  };
  
  // Load preview data for a breed
  const loadBreedPreview = async (breed) => {
    if (breedPreviews[breed]?.image && breedPreviews[breed]?.info) {
      // Already loaded
      return;
    }
    
    setLoadingPreviews(true);
    try {
      // Load breed image
      const images = await fetchRandomImages(breed, 1);
      const image = images.length > 0 ? images[0] : null;
      
      // Load breed info
      const info = await fetchBreedInfo(breed);
      
      // Update previews
      setBreedPreviews(prev => ({
        ...prev,
        [breed]: { image, info }
      }));
    } catch (err) {
      console.error(`Error loading preview for ${breed}:`, err);
    } finally {
      setLoadingPreviews(false);
    }
  };
  
  // Load previews for visible breeds when they come into view
  useEffect(() => {
    // Load first few visible breeds
    const loadInitialPreviews = async () => {
      const visibleBreeds = filteredBreeds.slice(0, 5);
      setLoadingPreviews(true);
      
      try {
        for (const breed of visibleBreeds) {
          if (!breedPreviews[breed]) {
            await loadBreedPreview(breed);
          }
        }
      } finally {
        setLoadingPreviews(false);
      }
    };
    
    if (filteredBreeds.length > 0 && Object.keys(breedPreviews).length === 0) {
      loadInitialPreviews();
    }
  }, [filteredBreeds]);

  if (isLoading) {
    return <div className="loading">Loading breeds...</div>;
  }

  if (error) {
    return <div className="error">Error loading breeds: {error}</div>;
  }
  function capitalizeFirstLetter(str) {
    if (typeof str !== 'string' || str.length === 0) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  // Toggle breed list visibility
  const toggleBreedList = () => {
    setShowBreedList(!showBreedList);
  };

  return (
    <div className="breed-list-container">
      <div className="collapsible-section">
        <div 
          className="collapsible-header active"
        >
          <h2>Dog Breeds</h2>
        </div>
        
        <div className="collapsible-content visible">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          {filteredBreeds.length === 0 ? (
            <p>No breeds found matching "{searchTerm}"</p>
          ) : (
            <ul className="breed-list">
              {filteredBreeds.map((breed) => (
                <li 
                  key={breed} 
                  className="breed-card"
                  onClick={() => handleBreedSelect(breed)}
                >
                  <div className="breed-card-header">
                    <h3 className="breed-name">{capitalizeFirstLetter(breed)}</h3>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default BreedList;
