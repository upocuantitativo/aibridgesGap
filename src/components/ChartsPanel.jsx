import React from 'react';
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { VARIABLE_IMPORTANCE } from '../model/neuralNetworkModel';
import { VARIABLES_DEFINITION } from '../data/variablesDefinition';
import './ChartsPanel.css';

const ChartsPanel = ({ currentValues, prediction }) => {
  // Prepare data for variable importance chart
  const importanceData = Object.entries(VARIABLE_IMPORTANCE)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([varName, importance]) => ({
      name: VARIABLES_DEFINITION[varName].name.length > 25
        ? VARIABLES_DEFINITION[varName].name.substring(0, 25) + '...'
        : VARIABLES_DEFINITION[varName].name,
      fullName: VARIABLES_DEFINITION[varName].name,
      importance: importance * 100,
      varName
    }));

  // Prepare data for current values vs optimal (top 10 variables)
  const topVariables = Object.entries(VARIABLE_IMPORTANCE)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const currentVsOptimalData = topVariables.map(([varName, importance]) => ({
    name: VARIABLES_DEFINITION[varName].name.length > 20
      ? VARIABLES_DEFINITION[varName].name.substring(0, 20) + '...'
      : VARIABLES_DEFINITION[varName].name,
    current: currentValues[varName],
    optimal: 5, // Optimal is maximum
    varName
  }));

  // Prepare radar chart data (top 8 for readability)
  const radarData = topVariables.slice(0, 8).map(([varName, importance]) => ({
    variable: VARIABLES_DEFINITION[varName].name.length > 15
      ? VARIABLES_DEFINITION[varName].name.substring(0, 15) + '...'
      : VARIABLES_DEFINITION[varName].name,
    current: currentValues[varName],
    optimal: 5,
    fullName: VARIABLES_DEFINITION[varName].name
  }));

  // Custom colors
  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#38f9d7', '#fa709a', '#fee140'];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{payload[0].payload.fullName || label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="charts-panel">
      <h2>Visual Analytics</h2>

      {/* Variable Importance */}
      <div className="chart-container">
        <h3>Top 15 Most Important Variables</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={importanceData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="importance" name="Importance (%)">
              {importanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Current vs Optimal */}
      <div className="chart-container">
        <h3>Current Values vs Optimal (Top 10 Variables)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={currentVsOptimalData}
            margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 5]} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="current" fill="#667eea" name="Current Value" />
            <Bar dataKey="optimal" fill="#43e97b" name="Optimal Value" opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart */}
      <div className="chart-container">
        <h3>Profile Analysis (Top 8 Variables)</h3>
        <ResponsiveContainer width="100%" height={450}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="variable" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis angle={90} domain={[0, 5]} />
            <Radar name="Current Values" dataKey="current" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
            <Radar name="Optimal Values" dataKey="optimal" stroke="#43e97b" fill="#43e97b" fillOpacity={0.3} />
            <Legend />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Probability Trend (simulated based on average of top variables) */}
      <div className="chart-container">
        <h3>Probability Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={[
              { step: 'Initial', probability: 0.33 },
              { step: 'Current', probability: prediction?.probability * 100 || 50 },
              { step: 'Potential', probability: Math.min(95, (prediction?.probability * 100 || 50) + 20) }
            ]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="step" />
            <YAxis domain={[0, 100]} label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="probability"
              stroke="#667eea"
              strokeWidth={3}
              dot={{ r: 6 }}
              name="Venture Creation Probability (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default ChartsPanel;
