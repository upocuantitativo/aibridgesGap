import React, { useState } from 'react';
import SensitivityAnalysis from './components/SensitivityAnalysis';
import Survey from './components/Survey';
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState('model');
  const [modelValues, setModelValues] = useState(null);

  const handleLoadToModel = (values) => {
    setModelValues(values);
    setCurrentTab('model');
    alert('Survey data loaded into the model! Check the Model Analysis tab.');
  };

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
          >
            📝 Survey
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentTab === 'model' && (
          <SensitivityAnalysis
            initialValues={modelValues}
            onTabChange={setCurrentTab}
          />
        )}

        {currentTab === 'survey' && (
          <Survey
            onLoadToModel={handleLoadToModel}
            onTabChange={setCurrentTab}
          />
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
