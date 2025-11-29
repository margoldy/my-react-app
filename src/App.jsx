import React, { useState, useEffect } from 'react';
import './App.css';

// сохранение в стор
const getInitialData = () => {
  try {
    const savedData = localStorage.getItem('votingData');
    return savedData ? JSON.parse(savedData) : null;
  } catch {
    return null;
  }
};
const initialData = getInitialData();

function App() {
    const [votingOptions, setVotingOptions] = useState(
    initialData?.votingOptions || [
      { id: 1, name: 'цветочек', image: '/images/flower.jpg', votes: 0 },
      { id: 2, name: 'сердечко', image: '/images/heart.jpg', votes: 0 },
      { id: 3, name: 'чаёк', image: '/images/tea.jpg', votes: 0 }
    ]
  );
  // выбранный вариант/ничего
  const [selectedOption, setSelectedOption] = useState(null);
  // false/true - голосование/результаты
  const [showResults, setShowResults] = useState(initialData?.showResults || false);

  useEffect(() => {
    const votingData = {
      votingOptions,
      showResults
    };
    localStorage.setItem('votingData', JSON.stringify(votingData));
  }, [votingOptions, showResults]);


  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleVote = () => {
    if (selectedOption) {
      setVotingOptions(prevOptions =>
        prevOptions.map(option =>
          option.id === selectedOption.id
            ? { ...option, votes: option.votes + 1 }
            : option
        )
      );
      setSelectedOption(null);
      setShowResults(true);
    }
  };

  const resetVoting = () => {
    setVotingOptions(prevOptions =>
      prevOptions.map(option => ({ ...option, votes: 0 }))
    );
    setSelectedOption(null);
    setShowResults(false);
  };

  // подсчёт всех голосов
  const totalVotes = votingOptions.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="app">
        <header className="app-header">
            <h1>Система голосования</h1>
            <p>Выберите самый лучший вариант</p>
        </header>
        <div className="stage">
            {!showResults && (
                <div className="voting-stage">
                    <div className="options-grid">
                        {votingOptions.map(option => (
                            <div
                            key={option.id}
                            className={`option-card ${selectedOption?.id === option.id ? 'selected' : ''}`}
                            onClick={() => handleOptionSelect(option)}
                            >
                                <div className="option-image">
                                    <img 
                                    src={option.image} 
                                    alt={option.name}
                                    className="option-real-image"
                                    />
                                </div>
                                <h3>{option.name}</h3>
                            </div>
                        ))}
                    </div>
                    {selectedOption && (
                    <button className="button vote-button" onClick={handleVote}>
                        Проголосовать
                    </button>
                    )}
                </div>
            )}

            {showResults && (
                <div className="results-stage">
                    <h2>Результаты голосования</h2>
                    <div className="results-summary">
                        <p>Всего голосов: <strong>{totalVotes}</strong></p>
                        <button 
                            className="button back-to-vote-button" 
                            onClick={() => setShowResults(false)}
                        > Вернуться к голосованию
                        </button>
                    </div>

                    <div className="results-list">
                    {votingOptions.map(option => {
                        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;

                        return (
                        <div key={option.id} className="result-item">
                            <div className="result-header">
                                <h3>{option.name}</h3>
                                <span className="vote-count">всего: {option.votes}</span>
                            </div>
                            
                            <div className="percentage-bar">
                                <div 
                                    className="percentage-fill"
                                    style={{ width: `${percentage}%` }}
                                    >
                                    {percentage > 15 && (
                                    <span className="percentage-text">{percentage.toFixed(1)}%</span>
                                    )}
                                </div>
                                {percentage <= 15 && (
                                    <span className="percentage-text" style={{ 
                                    position: 'absolute', 
                                    right: '20px',
                                    color: '#333'
                                    }}>
                                    {percentage.toFixed(1)}%
                                    </span>
                                )}
                            </div>
                        </div>
                        );
                    })}
                    </div>

                <button className="button reset-button" onClick={resetVoting}>
                Сбросить все голоса
                </button>
            </div>
            )}
        </div>
    </div>
  );
}

export default App;