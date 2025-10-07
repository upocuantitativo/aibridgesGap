import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Credentials
  const CORRECT_USERNAME = 'upocuantitativo';
  const CORRECT_PASSWORD = '1234uiOP$';

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
      setError('');
      onLogin();
    } else {
      setError('Incorrect username or password. Please try again.');
      setIsShaking(true);
      setPassword('');

      // Remove shake animation after it completes
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="network-animation"></div>
      </div>

      <div className={`login-box ${isShaking ? 'shake' : ''}`}>
        <div className="login-header">
          <div className="brain-icon">🧠</div>
          <h1>Predictive Edge of AI</h1>
          <h2>in Entrepreneurship</h2>
        </div>

        <div className="login-description">
          <p>Neural Network Model for New Venture Creation Prediction</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className={error ? 'error' : ''}
              autoFocus
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={error ? 'error' : ''}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Access Application
          </button>
        </form>

        <div className="login-footer">
          <div className="tech-specs">
            <span>🔬 Architecture: [50, 25, 12]</span>
            <span>⚡ TanhWithDropout</span>
            <span>📊 AUC-ROC: 0.77</span>
          </div>
        </div>

        <div className="credentials-info">
          <p className="info-text">
            <strong>Research Access Required</strong><br/>
            Contact research team for credentials
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
