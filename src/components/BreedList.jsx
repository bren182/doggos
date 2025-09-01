import { useState } from 'react';

function BreedList({ breeds, isLoading, error, onBreedSelect }) {
  const [searchTerm, setSearchTerm] = useState('');

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
  return (
    <div className="breed-list-container">
      <h2>Dog Breeds</h2>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a breed..."
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
            <li key={breed} onClick={() => handleBreedSelect(breed)} className="breed-item">
              
              {capitalizeFirstLetter(breed)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BreedList;
