import React, { useState, useEffect } from 'react';
import { VARIABLES_DEFINITION, CATEGORIES, getDefaultValues } from '../data/variablesDefinition';
import { neuralNetwork, getProbabilityColor, formatProbability } from '../model/neuralNetworkModel';
import NeuralNetworkVisualization from './NeuralNetworkVisualization';
import ChartsPanel from './ChartsPanel';
import './SensitivityAnalysis.css';

const SensitivityAnalysis = ({ initialValues, onTabChange }) => {
  const [values, setValues] = useState(getDefaultValues());
  const [expandedVars, setExpandedVars] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // Load initial values when provided from Survey
  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
    }
  }, [initialValues]);

  // Update prediction whenever values change
  useEffect(() => {
    const varNames = Object.keys(VARIABLES_DEFINITION);
    const inputArray = varNames.map(name => values[name]);
    const result = neuralNetwork.predict(inputArray);
    setPrediction(result);

    // Get recommendations - calculate all and take top 10
    const allRecs = neuralNetwork.getRecommendations(inputArray);
    // Filter out recommendations that would have minimal impact
    const significantRecs = allRecs.filter(rec => rec.potentialIncrease > 0.0001);
    setRecommendations(significantRecs.slice(0, 10)); // Top 10 significant recommendations
  }, [values]);

  const toggleVariable = (varName) => {
    setExpandedVars(prev => ({
      ...prev,
      [varName]: !prev[varName]
    }));
  };

  const handleValueChange = (varName, newValue) => {
    const numValue = parseFloat(newValue);
    setValues(prev => ({
      ...prev,
      [varName]: numValue
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
      {/* Fixed Header with Title, Tabs, and Probability */}
      <div className="fixed-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Predictive Edge of AI in Entrepreneurship</h1>
            <p className="subtitle">Neural Network Model for New Venture Creation Prediction</p>
            <div className="header-tabs">
              <button className="tab-button active">
                🎯 Model Analysis
              </button>
              <button className="tab-button" onClick={() => onTabChange && onTabChange('survey')}>
                📝 Survey
              </button>
            </div>
          </div>
          <div className="header-right">
            <div className="probability-mini">
              <span className="probability-mini-label">Venture Creation Probability</span>
              <div
                className="probability-mini-value"
                style={{
                  backgroundColor: getProbabilityColor(prediction?.probability || 0.5),
                  color: 'white'
                }}
              >
                {formatProbability(prediction?.probability || 0.5)}
              </div>
            </div>
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
              const isDecrease = rec.direction === 'decrease';
              const currentActualValue = values[rec.variable];

              // Skip if current value already matches suggested value
              if (Math.abs(currentActualValue - rec.suggestedValue) < 0.01) {
                return null;
              }

              return (
                <div key={`${rec.variable}-${rec.direction}-${idx}`} className="recommendation-card">
                  <div className="rec-header">
                    <span className="rec-rank">#{idx + 1}</span>
                    <span className="rec-variable">{varDef.name}</span>
                    {isDecrease && <span className="rec-direction-badge">↓ Decrease</span>}
                    {!isDecrease && <span className="rec-direction-badge increase">↑ Increase</span>}
                  </div>
                  <div className="rec-details">
                    <div className="rec-row">
                      <span className="rec-label">Current Value:</span>
                      <span className="rec-value">{currentActualValue.toFixed(1)}</span>
                    </div>
                    <div className="rec-row">
                      <span className="rec-label">Suggested Value:</span>
                      <span className="rec-value suggested">{rec.suggestedValue.toFixed(1)}</span>
                    </div>
                    <div className="rec-row">
                      <span className="rec-label">Potential Impact:</span>
                      <span className="rec-value impact">
                        +{(rec.potentialIncrease * 100).toFixed(3)}%
                      </span>
                    </div>
                  </div>
                  <button
                    className="apply-button"
                    onClick={() => {
                      handleValueChange(rec.variable, rec.suggestedValue);
                    }}
                  >
                    Apply Suggestion {isDecrease ? '↓' : '↑'}
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

      {/* Neural Network and Charts */}
      <div className="container">
        <NeuralNetworkVisualization
          activations={prediction?.activations}
          weights={neuralNetwork.weights}
        />

        <ChartsPanel
          currentValues={values}
          prediction={prediction}
        />
      </div>
    </div>
  );
};

export default SensitivityAnalysis;
