import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { VARIABLE_IMPORTANCE } from '../model/neuralNetworkModel';
import { VARIABLES_DEFINITION, CATEGORIES } from '../data/variablesDefinition';
import './ChartsPanel.css';

const ChartsPanel = ({ currentValues, prediction }) => {
  // Top 15 variables from variables.png
  const top15Variables = [
    "A8_Intention_Implementation",
    "A7_Intention_Entrepreneurship",
    "A6_2_Mot_Pull_Lifestyle",
    "E7_2_Other_Role_Model",
    "A5_Self_Efficacy",
    "C3_Creativity",
    "D1_1_lack_personal_resources",
    "C6_Resources",
    "A4_Identity_Proccess",
    "D1_2_personal_fear_failure",
    "C1_Opportunities",
    "D5_UniversitySupport",
    "B5_Risk_Assumption",
    "A6_1_Mot_Pull_Oportunity",
    "A6_3_Mot_Push"
  ];

  // Get category for each variable
  const getCategoryForVariable = (varName) => {
    for (const [category, varNames] of Object.entries(CATEGORIES)) {
      if (varNames.includes(varName)) {
        return category;
      }
    }
    return 'Unknown';
  };

  // Prepare radar chart data (top 15 variables)
  const radarData = top15Variables.map((varName) => ({
    variable: VARIABLES_DEFINITION[varName]?.name.length > 12
      ? VARIABLES_DEFINITION[varName].name.substring(0, 12) + '...'
      : VARIABLES_DEFINITION[varName]?.name || varName,
    current: currentValues[varName] || 3,
    optimal: 5,
    fullName: VARIABLES_DEFINITION[varName]?.name || varName,
    category: getCategoryForVariable(varName)
  }));

  // Custom colors
  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#38f9d7', '#fa709a', '#fee140'];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{data.fullName || label}</p>
          {data.category && <p className="category-label">Category: {data.category}</p>}
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

      {/* Radar Chart */}
      <div className="chart-container">
        <h3>Profile Analysis (Top 15 Variables)</h3>
        <ResponsiveContainer width="100%" height={550}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="variable" tick={{ fontSize: 9 }} />
            <PolarRadiusAxis angle={90} domain={[0, 5]} />
            <Radar name="Current Values" dataKey="current" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
            <Radar name="Optimal Values" dataKey="optimal" stroke="#43e97b" fill="#43e97b" fillOpacity={0.3} />
            <Legend />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default ChartsPanel;
