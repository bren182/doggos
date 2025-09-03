import { useState, useEffect } from 'react'
import './App.css'
import BreedList from './components/BreedList'
import ImageDisplay from './components/ImageDisplay'
import Login from './components/Login'
import UserProfile from './components/UserProfile'
import RandomBreed from './components/RandomBreed'
import BreedGame from './components/BreedGame'
import BreedStats from './components/BreedStats'
import { fetchBreeds, fetchRandomImages, fetchBreedInfo } from './services/api'
import { isAuthenticated, getCurrentUser } from './services/auth'

function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  
  // App state variables
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [breedImages, setBreedImages] = useState([]);
  const [breedInfo, setBreedInfo] = useState(null);
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isLoadingBreedInfo, setIsLoadingBreedInfo] = useState(false);
  const [breedsError, setBreedsError] = useState(null);
  const [imagesError, setImagesError] = useState(null);
  const [breedInfoError, setBreedInfoError] = useState(null);
  const [activeTab, setActiveTab] = useState('breedList');

  // Fetch all breeds when logged in
  useEffect(() => {
    if (isLoggedIn) {
      const getBreeds = async () => {
        try {
          setIsLoadingBreeds(true);
          setBreedsError(null);
          const data = await fetchBreeds();
          setBreeds(data);
        } catch (error) {
          setBreedsError(error.message);
        } finally {
          setIsLoadingBreeds(false);
        }
      };
  
      getBreeds();
    }
  }, [isLoggedIn]);

  // Fetch images and info when a breed is selected
  useEffect(() => {
    if (!selectedBreed) return;

    const getImages = async () => {
      try {
        setIsLoadingImages(true);
        setImagesError(null);
        const images = await fetchRandomImages(selectedBreed, 3);
        setBreedImages(images);
      } catch (error) {
        setImagesError(error.message);
      } finally {
        setIsLoadingImages(false);
      }
    };
    
    const getBreedInfo = async () => {
      try {
        setIsLoadingBreedInfo(true);
        setBreedInfoError(null);
        const info = await fetchBreedInfo(selectedBreed);
        setBreedInfo(info);
      } catch (error) {
        setBreedInfoError(error.message);
        console.error('Error fetching breed info:', error);
      } finally {
        setIsLoadingBreedInfo(false);
      }
    };

    getImages();
    getBreedInfo();
  }, [selectedBreed]);

  // Handle login success
  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSelectedBreed(null);
    setBreedImages([]);
  };

  // Handle breed selection
  const handleBreedSelect = (breed) => {
    setSelectedBreed(breed);
  };

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Dog Breed Viewer</h1>
        {currentUser && <UserProfile user={currentUser} onLogout={handleLogout} />}
      </header>
      
      <div className="app-tabs">
        <button 
          className={`tab-button ${activeTab === 'breedList' ? 'active' : ''}`}
          onClick={() => setActiveTab('breedList')}
        >
          Breed List
        </button>
        <button 
          className={`tab-button ${activeTab === 'randomBreed' ? 'active' : ''}`}
          onClick={() => setActiveTab('randomBreed')}
        >
          Random Breed
        </button>
        <button 
          className={`tab-button ${activeTab === 'breedGame' ? 'active' : ''}`}
          onClick={() => setActiveTab('breedGame')}
        >
          Breed Challenge
        </button>
      </div>
      
      <main className="app-content">
        {activeTab === 'breedList' && (
          <div className="breed-list-layout">
            <div className="breeds-section">
              <BreedList 
                breeds={breeds} 
                isLoading={isLoadingBreeds} 
                error={breedsError} 
                onBreedSelect={handleBreedSelect} 
              />
            </div>
            
            {selectedBreed && (
              <div className="breed-detail-section">
                <div className="random-breed-container">
                  <h2>{selectedBreed}</h2>
                  
                  {isLoadingBreedInfo || isLoadingImages ? (
                    <div className="loading">Loading breed information...</div>
                  ) : (breedInfoError || imagesError) ? (
                    <div className="error">{breedInfoError || imagesError}</div>
                  ) : (
                    <div className="breed-display">
                      <div className="breed-content">
                        <div className="breed-info">
                          <h4>Breed Information</h4>
                          {breedInfo && (
                            <>
                              <div className="info-card summary">
                                {breedInfo.min_height_male && (
                                  <div className="info-item">
                                    <span className="info-label">Size:</span>
                                    <span className="info-value">{breedInfo.min_height_male || '?'} to {breedInfo.max_height_male || '?'} inches</span>
                                  </div>
                                )}
                                {breedInfo.min_weight_male && (
                                  <div className="info-item">
                                    <span className="info-label">Weight:</span>
                                    <span className="info-value">{breedInfo.min_weight_male || '?'} to {breedInfo.max_weight_male || '?'} pounds</span>
                                  </div>
                                )}
                                {breedInfo.min_life_expectancy && (
                                  <div className="info-item">
                                    <span className="info-label">Lifespan:</span>
                                    <span className="info-value">{breedInfo.min_life_expectancy || '?'} to {breedInfo.max_life_expectancy || '?'} years</span>
                                  </div>
                                )}
                                {breedInfo.temperament && (
                                  <div className="info-item">
                                    <span className="info-label">Temperament:</span>
                                    <span className="info-value">{breedInfo.temperament}</span>
                                  </div>
                                )}
                              </div>
                              
                              <BreedStats breedInfo={breedInfo} />
                            </>
                          )}
                        </div>
                        
                        <div className="breed-images">
                          {breedImages.map((image, index) => (
                            <div key={index} className="image-card">
                              <img src={image} alt={`${selectedBreed} ${index + 1}`} loading="lazy" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'randomBreed' && (
          <div className="random-breed-section">
            <RandomBreed />
          </div>
        )}
        
        {activeTab === 'breedGame' && (
          <div className="breed-game-section">
            <BreedGame />
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Dog Breed Viewer - Created with React</p>
      </footer>
    </div>
  )
}

export default App
