import React, { useState } from 'react';
import Login from './components/Login';
import SensitivityAnalysis from './components/SensitivityAnalysis';
import NeuralNetworkVisualization from './components/NeuralNetworkVisualization';
import ChartsPanel from './components/ChartsPanel';
import { getDefaultValues } from './data/variablesDefinition';
import { neuralNetwork } from './model/neuralNetworkModel';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState('model');
  const [values, setValues] = useState(getDefaultValues());
  const [prediction, setPrediction] = useState(null);

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  // Update prediction when values change (handled in SensitivityAnalysis)
  React.useEffect(() => {
    try {
      const varNames = Object.keys(values);
      if (varNames.length > 0) {
        const inputArray = varNames.map(name => values[name]);
        const result = neuralNetwork.predict(inputArray);
        setPrediction(result);
      }
    } catch (error) {
      console.error('Error updating prediction:', error);
    }
  }, [values]);

  return (
    <div className="app">
      <nav className="navigation">
        <div className="nav-container">
          <button
            className={`nav-button ${currentTab === 'model' ? 'active' : ''}`}
            onClick={() => setCurrentTab('model')}
          >
            🎯 Model Analysis
          </button>
          <button
            className={`nav-button ${currentTab === 'survey' ? 'active' : ''}`}
            onClick={() => setCurrentTab('survey')}
            disabled
            title="Survey form - Coming soon"
          >
            📝 Survey (Coming Soon)
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentTab === 'model' && (
          <>
            <SensitivityAnalysis />

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
          </>
        )}

        {currentTab === 'survey' && (
          <div className="coming-soon">
            <h2>Survey Form</h2>
            <p>This feature will be available soon. You will be able to:</p>
            <ul>
              <li>Complete the entrepreneurship survey</li>
              <li>Save your responses</li>
              <li>View personalized recommendations</li>
              <li>Track your progress over time</li>
            </ul>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>
            Predictive Edge of AI in Entrepreneurship - Neural Network Model for New Venture Creation
          </p>
          <p className="footer-tech">
            Architecture: [50, 25, 12] (87 neurons) | RectifierWithDropout | Learning Rate: 0.005 | AUC-ROC: 0.972
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
