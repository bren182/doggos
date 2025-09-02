import { useState, useEffect } from 'react'
import './App.css'
import BreedList from './components/BreedList'
import ImageDisplay from './components/ImageDisplay'
import Login from './components/Login'
import UserProfile from './components/UserProfile'
import RandomBreed from './components/RandomBreed'
import { fetchBreeds, fetchRandomImages } from './services/api'
import { isAuthenticated, getCurrentUser } from './services/auth'

function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  
  // App state variables
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [breedImages, setBreedImages] = useState([]);
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [breedsError, setBreedsError] = useState(null);
  const [imagesError, setImagesError] = useState(null);
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

  // Fetch images when a breed is selected
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

    getImages();
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
      </div>
      
      <main className="app-content">
        {activeTab === 'breedList' && (
          <>
            <div className="breeds-section">
              <BreedList 
                breeds={breeds} 
                isLoading={isLoadingBreeds} 
                error={breedsError} 
                onBreedSelect={handleBreedSelect} 
              />
            </div>
            
            <div className="images-section">
              <ImageDisplay 
                breedImages={breedImages} 
                isLoading={isLoadingImages} 
                error={imagesError} 
                selectedBreed={selectedBreed} 
              />
            </div>
          </>
        )}
        
        {activeTab === 'randomBreed' && (
          <div className="random-breed-section">
            <RandomBreed />
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
