import { useState, useEffect } from 'react';
import { fetchBreeds, fetchBreedInfo, fetchRandomImages } from '../services/api';
import BreedScoreboard from './BreedScoreboard';
import BreedStats from './BreedStats';
import './BreedScoreboard.css';
import './BreedGame.css';

const BreedGame = () => {
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState('notStarted'); // notStarted, playing, won, lost
  const [dailyBreed, setDailyBreed] = useState(null);
  const [breedInfo, setBreedInfo] = useState(null);
  const [breedImage, setBreedImage] = useState('');
  const [revealedClues, setRevealedClues] = useState(0);
  const [guessInput, setGuessInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [allBreeds, setAllBreeds] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [lastPlayedDate, setLastPlayedDate] = useState(null);
  const [showScoreboard, setShowScoreboard] = useState(false);

  // Maximum number of clues before revealing the answer
  const MAX_CLUES = 4;
  // Maximum number of attempts allowed
  const MAX_ATTEMPTS = 5;

  // Initialize the game on component mount
  useEffect(() => {
    const initGame = async () => {
      try {
        setLoading(true);
        
        // Check if the player has already played today
        const savedDate = localStorage.getItem('lastPlayedDate');
        const today = new Date().toDateString();
        
        if (savedDate === today) {
          // Player has already played today, load saved game state
          const savedState = JSON.parse(localStorage.getItem('gameState') || '{}');
          
          if (savedState.breed) {
            setDailyBreed(savedState.breed);
            setBreedInfo(savedState.breedInfo);
            setBreedImage(savedState.image);
            setGameState(savedState.state || 'notStarted');
            setScore(savedState.score || 0);
            setLastPlayedDate(savedDate);
          } else {
            // Something went wrong with saved state, start a new game
            await setupNewGame();
          }
        } else {
          // New day, start a fresh game
          await setupNewGame();
          localStorage.setItem('lastPlayedDate', today);
        }
        
        // Load all breeds for autocomplete
        const breeds = await fetchBreeds();
        setAllBreeds(breeds);
        
      } catch (error) {
        console.error("Error initializing game:", error);
        setFeedback("Error loading the game. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    initGame();
  }, []);
  
  // Set up a new game with a random breed
  const setupNewGame = async () => {
    try {
      // Get all breeds first
      const breeds = await fetchBreeds();
      
      // Use date-based seed for "random" selection to ensure same breed for everyone on a given day
      const today = new Date();
      const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
      const randomIndex = seed % breeds.length;
      const selectedBreed = breeds[randomIndex];
      
      // Get breed info
      const info = await fetchBreedInfo(selectedBreed);
      
      // Get a single image
      const images = await fetchRandomImages(selectedBreed, 1);
      
      setDailyBreed(selectedBreed);
      setBreedInfo(info);
      setBreedImage(images[0]);
      setGameState('notStarted');
      setRevealedClues(0);
      setAttempts(0);
      setFeedback('');
      
      // Save this state
      saveGameState(selectedBreed, info, images[0], 'notStarted', 0);
    } catch (error) {
      console.error("Error setting up new game:", error);
      setFeedback("Error creating challenge. Please try again.");
    }
  };
  
  // Save current game state to localStorage
  const saveGameState = (breed, info, image, state, currentScore) => {
    localStorage.setItem('gameState', JSON.stringify({
      breed,
      breedInfo: info,
      image,
      state,
      score: currentScore
    }));
  };
  
  // Save game to history
  const saveGameHistory = (breed, result, gameScore, cluesUsed) => {
    try {
      // Get existing history or create new array
      const existingHistory = JSON.parse(localStorage.getItem('breedGameHistory') || '[]');
      
      // Add new game to history
      existingHistory.push({
        date: new Date().toISOString(),
        breed,
        result,
        score: gameScore,
        cluesUsed,
        maxClues: MAX_CLUES
      });
      
      // Save updated history
      localStorage.setItem('breedGameHistory', JSON.stringify(existingHistory));
    } catch (error) {
      console.error('Error saving game history:', error);
    }
  };
  
  // Toggle scoreboard visibility
  const toggleScoreboard = () => {
    setShowScoreboard(!showScoreboard);
  };
  
  // Start the game
  const startGame = () => {
    setGameState('playing');
    setRevealedClues(1); // Reveal the first clue
    saveGameState(dailyBreed, breedInfo, breedImage, 'playing', score);
  };
  
  // Reveal the next clue
  const revealNextClue = () => {
    if (revealedClues < MAX_CLUES) {
      setRevealedClues(revealedClues + 1);
    }
  };
  
  // Handle guess submission
  const handleGuessSubmit = (e) => {
    e.preventDefault();
    
    const normalizedGuess = guessInput.toLowerCase().trim();
    const normalizedBreed = dailyBreed.toLowerCase().trim();
    
    // Check if the guess is correct
    if (normalizedGuess === normalizedBreed) {
      // Calculate score based on number of clues revealed (fewer clues = higher score)
      const newScore = score + (MAX_CLUES - revealedClues + 1) * 100;
      setScore(newScore);
      setGameState('won');
      setFeedback(`Correct! The breed is ${dailyBreed}. You earned ${(MAX_CLUES - revealedClues + 1) * 100} points!`);
      saveGameState(dailyBreed, breedInfo, breedImage, 'won', newScore);
      
      // Save to game history
      saveGameHistory(dailyBreed, 'won', newScore, revealedClues);
    } else {
      // Incorrect guess
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setGameState('lost');
        setFeedback(`Sorry, you've run out of attempts! The breed was ${dailyBreed}.`);
        saveGameState(dailyBreed, breedInfo, breedImage, 'lost', score);
        
        // Save to game history
        saveGameHistory(dailyBreed, 'lost', 0, MAX_CLUES);
      } else {
        setFeedback(`Incorrect guess. You have ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
        // Reveal next clue as a hint after wrong guess
        if (revealedClues < MAX_CLUES) {
          setRevealedClues(revealedClues + 1);
        }
      }
    }
    
    setGuessInput('');
  };
  
  // Format the clues based on breed information
  const getClues = () => {
    if (!breedInfo) return [];
    
    return [
      `This breed typically stands ${breedInfo.min_height_male || '?'} to ${breedInfo.max_height_male || '?'} inches tall.`,
      `The temperament is described as: ${breedInfo.temperament || 'Information not available'}.`,
      `This breed typically lives ${breedInfo.min_life_expectancy || '?'} to ${breedInfo.max_life_expectancy || '?'} years.`,
      `Here's what this breed looks like:`
    ];
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="breed-game-container">
        <h2>Daily Breed Challenge</h2>
        <div className="loading">Loading today's challenge...</div>
      </div>
    );
  }

  return (
    <div className="breed-game-container">
      <div className="game-header">
        <h2>Daily Breed Challenge</h2>
        <button 
          className="toggle-scoreboard-btn" 
          onClick={toggleScoreboard}
        >
          {showScoreboard ? 'Back to Game' : 'View Scoreboard'}
        </button>
      </div>
      
      {showScoreboard ? (
        <BreedScoreboard />
      ) : (
        <>
          {gameState === 'notStarted' && (
            <div className="game-intro">
              <p>Welcome to the Daily Breed Challenge! Try to guess today's mystery dog breed.</p>
              <p>You'll receive clues one by one to help you guess. Each clue makes it easier, but you'll score higher if you guess with fewer clues!</p>
              <button className="game-button" onClick={startGame}>Start Today's Challenge</button>
              {lastPlayedDate && <p className="last-played">You last played on {lastPlayedDate}</p>}
            </div>
          )}
      
          {gameState === 'playing' && (
            <div className="game-board">
              <div className="score-display">
                <span>Score: {score}</span>
                <span>Attempts: {attempts}/{MAX_ATTEMPTS}</span>
              </div>
              
              <div className="clues-section">
                <h3>Clues</h3>
                <div className="clue-list">
                  {getClues().slice(0, revealedClues).map((clue, index) => (
                    <div key={index} className="clue-item">
                      <span className="clue-number">{index + 1}</span>
                      <span className="clue-text">{clue}</span>
                    </div>
                  ))}
                  
                  {revealedClues === MAX_CLUES && (
                    <div className="breed-image">
                      <img src={breedImage} alt="Mystery breed" loading="lazy" />
                    </div>
                  )}
                </div>
                
                {revealedClues < MAX_CLUES && (
                  <button className="clue-button" onClick={revealNextClue}>
                    Reveal Next Clue ({revealedClues}/{MAX_CLUES})
                  </button>
                )}
              </div>
              
              <form onSubmit={handleGuessSubmit} className="guess-form">
                <div className="input-group">
                  <label htmlFor="breed-guess">Your Guess:</label>
                  <input
                    id="breed-guess"
                    type="text"
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    list="breed-options"
                    placeholder="Type a breed name..."
                    required
                  />
                  <datalist id="breed-options">
                    {allBreeds.map((breed, index) => (
                      <option key={index} value={breed} />
                    ))}
                  </datalist>
                </div>
                <button type="submit" className="submit-button">Submit Guess</button>
              </form>
              
              {feedback && <div className="feedback-message">{feedback}</div>}
            </div>
          )}
          
          {(gameState === 'won' || gameState === 'lost') && (
            <div className="game-result">
              <h3>{gameState === 'won' ? 'Congratulations!' : 'Better luck tomorrow!'}</h3>
              <p>{feedback}</p>
              <div className="breed-reveal">
                <h4>The breed was: {dailyBreed}</h4>
                <div className="breed-image">
                  <img src={breedImage} alt={dailyBreed} loading="lazy" />
                </div>
                <div className="breed-details">
                  <h4>Breed Information</h4>
                  {breedInfo && <BreedStats breedInfo={breedInfo} />}
                </div>
              </div>
              <p className="come-back-message">Come back tomorrow for a new challenge!</p>
              <div className="score-display">
                <span>Total Score: {score}</span>
              </div>
              <button 
                className="view-scoreboard-btn" 
                onClick={toggleScoreboard}
              >
                View Your Scoreboard
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BreedGame;
