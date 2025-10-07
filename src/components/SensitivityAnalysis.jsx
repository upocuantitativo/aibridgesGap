import React, { useState, useEffect } from 'react';
import { VARIABLES_DEFINITION, CATEGORIES, getDefaultValues } from '../data/variablesDefinition';
import { neuralNetwork, getProbabilityColor, formatProbability } from '../model/neuralNetworkModel';
import './SensitivityAnalysis.css';

const SensitivityAnalysis = () => {
  const [values, setValues] = useState(getDefaultValues());
  const [expandedVars, setExpandedVars] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // Update prediction whenever values change
  useEffect(() => {
    const varNames = Object.keys(VARIABLES_DEFINITION);
    const inputArray = varNames.map(name => values[name]);
    const result = neuralNetwork.predict(inputArray);
    setPrediction(result);

    // Get recommendations
    const recs = neuralNetwork.getRecommendations(inputArray);
    setRecommendations(recs.slice(0, 10)); // Top 10 recommendations
  }, [values]);

  const toggleVariable = (varName) => {
    setExpandedVars(prev => ({
      ...prev,
      [varName]: !prev[varName]
    }));
  };

  const handleValueChange = (varName, newValue) => {
    setValues(prev => ({
      ...prev,
      [varName]: parseFloat(newValue)
    }));
  };

  const getProbabilityLabel = (prob) => {
    if (prob < 0.3) return 'Low Probability';
    if (prob < 0.5) return 'Moderate-Low Probability';
    if (prob < 0.7) return 'Moderate-High Probability';
    return 'High Probability';
  };

  return (
    <div className="sensitivity-analysis">
      <header className="header">
        <h1>Predictive Edge of AI in Entrepreneurship</h1>
        <p className="subtitle">Neural Network Model for New Venture Creation Prediction</p>
      </header>

      {/* Prediction Display */}
      <div className="prediction-container">
        <h2>Venture Creation Probability</h2>
        <div
          className="probability-display"
          style={{
            backgroundColor: getProbabilityColor(prediction?.probability || 0.5),
            color: 'white'
          }}
        >
          <div className="probability-value">
            {formatProbability(prediction?.probability || 0.5)}
          </div>
          <div className="probability-label">
            {getProbabilityLabel(prediction?.probability || 0.5)}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Variables Section */}
        <div className="variables-section">
          <h2>Model Variables</h2>
          <p className="section-description">
            Adjust the variables below to see how they affect the probability of venture creation.
            Click on each variable to expand and see the underlying survey questions.
          </p>

          {Object.entries(CATEGORIES).map(([category, varNames]) => (
            <div key={category} className="category-group">
              <h3 className="category-title">{category}</h3>
              {varNames.map(varName => {
                const varDef = VARIABLES_DEFINITION[varName];
                const isExpanded = expandedVars[varName];
                const currentValue = values[varName];

                return (
                  <div key={varName} className="variable-card">
                    <div
                      className="variable-header"
                      onClick={() => toggleVariable(varName)}
                    >
                      <div className="variable-info">
                        <span className="variable-name">{varDef.name}</span>
                        <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                      </div>
                      <div className="variable-control">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="0.1"
                          value={currentValue}
                          onChange={(e) => handleValueChange(varName, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="slider"
                        />
                        <span className="value-display">{currentValue.toFixed(1)}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="variable-details">
                        <div className="questions-section">
                          <h4>Survey Questions:</h4>
                          <ul>
                            {varDef.questions.map((q, idx) => (
                              <li key={idx}>{q}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="source-section" title={varDef.source}>
                          <strong>Source:</strong> {varDef.source}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Recommendations Section */}
        <div className="recommendations-section">
          <h2>Priority Recommendations</h2>
          <p className="section-description">
            Based on the current values, these are the most impactful changes to increase venture creation probability:
          </p>

          <div className="recommendations-list">
            {recommendations.map((rec, idx) => {
              const varDef = VARIABLES_DEFINITION[rec.variable];
              return (
                <div key={rec.variable} className="recommendation-card">
                  <div className="rec-header">
                    <span className="rec-rank">#{idx + 1}</span>
                    <span className="rec-variable">{varDef.name}</span>
                  </div>
                  <div className="rec-details">
                    <div className="rec-row">
                      <span className="rec-label">Current Value:</span>
                      <span className="rec-value">{rec.currentValue.toFixed(1)}</span>
                    </div>
                    <div className="rec-row">
                      <span className="rec-label">Suggested Value:</span>
                      <span className="rec-value suggested">{rec.suggestedValue.toFixed(1)}</span>
                    </div>
                    <div className="rec-row">
                      <span className="rec-label">Potential Impact:</span>
                      <span className="rec-value impact">
                        +{formatProbability(rec.potentialIncrease)}
                      </span>
                    </div>
                  </div>
                  <button
                    className="apply-button"
                    onClick={() => handleValueChange(rec.variable, rec.suggestedValue)}
                  >
                    Apply Suggestion
                  </button>
                </div>
              );
            })}
          </div>

          {recommendations.length === 0 && (
            <div className="no-recommendations">
              <p>All variables are at optimal levels! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SensitivityAnalysis;
