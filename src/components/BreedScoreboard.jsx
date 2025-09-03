import React, { useState, useEffect } from 'react';
import './BreedScoreboard.css';

/**
 * BreedScoreboard component - Displays game scores and history
 */
const BreedScoreboard = () => {
  const [scoreHistory, setScoreHistory] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  
  useEffect(() => {
    loadScoreData();
  }, []);
  
  // Load score data from localStorage
  const loadScoreData = () => {
    try {
      // Get score history
      const savedHistory = JSON.parse(localStorage.getItem('breedGameHistory') || '[]');
      setScoreHistory(savedHistory);
      
      // Calculate total score
      const total = savedHistory.reduce((sum, game) => sum + (game.score || 0), 0);
      setTotalScore(total);
      
      // Calculate streaks
      let current = 0;
      let best = 0;
      
      // Go through history in reverse to get most recent games first
      for (let i = savedHistory.length - 1; i >= 0; i--) {
        if (savedHistory[i].result === 'won') {
          current++;
          // Update best streak if current is better
          if (current > best) {
            best = current;
          }
        } else {
          // Reset current streak on loss
          current = 0;
        }
      }
      
      setCurrentStreak(current);
      setBestStreak(best);
    } catch (error) {
      console.error("Error loading score data:", error);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return 'Unknown date';
    }
  };
  
  // Clear score history
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your score history? This cannot be undone.")) {
      localStorage.removeItem('breedGameHistory');
      setScoreHistory([]);
      setTotalScore(0);
      setBestStreak(0);
      setCurrentStreak(0);
    }
  };
  
  return (
    <div className="scoreboard-container">
      <h2>Your Breed Challenge Stats</h2>
      
      <div className="stats-summary">
        <div className="stat-box">
          <span className="stat-value">{totalScore}</span>
          <span className="stat-label">Total Score</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{scoreHistory.length}</span>
          <span className="stat-label">Games Played</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{currentStreak}</span>
          <span className="stat-label">Current Streak</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{bestStreak}</span>
          <span className="stat-label">Best Streak</span>
        </div>
      </div>
      
      {scoreHistory.length > 0 ? (
        <div className="score-history">
          <h3>Game History</h3>
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Breed</th>
                <th>Result</th>
                <th>Score</th>
                <th>Clues Used</th>
              </tr>
            </thead>
            <tbody>
              {scoreHistory.slice().reverse().map((game, index) => (
                <tr key={index} className={game.result}>
                  <td>{formatDate(game.date)}</td>
                  <td>{game.breed}</td>
                  <td className={`result ${game.result}`}>
                    {game.result === 'won' ? 'Won' : 'Lost'}
                  </td>
                  <td>{game.score}</td>
                  <td>{game.cluesUsed}/{game.maxClues}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <button className="clear-history-button" onClick={handleClearHistory}>
            Clear History
          </button>
        </div>
      ) : (
        <div className="no-history-message">
          <p>No game history yet. Play the Daily Breed Challenge to start tracking your scores!</p>
        </div>
      )}
    </div>
  );
};

export default BreedScoreboard;
