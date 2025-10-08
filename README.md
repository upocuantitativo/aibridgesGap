# Predictive Edge of AI in Entrepreneurship

An interactive web application for analyzing entrepreneurial potential using a Deep Neural Network model. This application provides real-time sensitivity analysis, recommendations, and visualizations to help understand the factors that influence new venture creation.

## Features

### 🎯 Model Analysis Tab
- **Sensitivity Analysis**: Interactive sliders for 35 entrepreneurship variables grouped by category
- **Real-time Predictions**: Venture creation probability updates dynamically as you adjust variables
- **Color-coded Visualization**: Red (low probability) to blue (high probability) gradient display
- **Expandable Variables**: Click any variable to see underlying survey questions and academic sources
- **Priority Recommendations**: AI-powered suggestions on which variables to improve for maximum impact
- **Neural Network Visualization**: Interactive visualization of the [50, 25, 12] architecture with live activations
- **Comprehensive Charts**:
  - Variable importance rankings
  - Current vs optimal values comparison
  - Profile analysis radar chart
  - Probability trend visualization

### 📝 Survey Tab (Coming Soon)
- Complete entrepreneurship assessment survey
- Save and track responses over time
- Personalized action plans
- Progress monitoring

## Technical Details

### Model Architecture

The model employs a Deep Neural Network built with the H2O framework, utilizing the robust backpropagation algorithm based on standard backpropagation technique with modifications for weight optimization to locate local minima of the error function.

**Architecture Configuration:**
- **Type**: Deep Neural Network (H2O Framework)
- **Hidden Layers**: 3 layers with [50, 25, 12] neurons - 87 total hidden neurons
- **Activation Function**: RectifierWithDropout
- **Learning Rate**: 0.005 (tested at different rates for optimal performance)
- **Dropout Rates**:
  - Input layer: 0.1
  - Hidden layers: [0.3, 0.3, 0.3]
- **Regularization**:
  - L1: 1e-05
  - L2: 1e-04
- **Early Stopping**: Patience of 10 epochs based on validation AUC
- **Random Seed**: 12345 (for reproducibility)
- **Class Balancing**: Balanced class weighting in loss function (152 positive vs. 302 negative cases, ratio 1:1.99)
- **Threshold Optimization**: Determined by maximizing F1-score on validation set

**Training Methodology:**

The model development employed an iterative approach starting with 9 neurons and one hidden layer, progressively adding complexity through hidden layers and neurons. Multiple configurations were evaluated using backpropagation, resilient backpropagation (RPROP), and modified globally convergent version (GRPROP).

**Validation Strategy:**

Nested cross-validation approach:
- **Data Split**: 70% training (n=318) and 30% holdout test (n=136) using stratified sampling
- **Cross-Validation**: 3-fold cross-validation on training set for hyperparameter tuning
- **Search Strategy**: Cartesian search for hyperparameter exploration
- **Reporting**: All metrics from final 30% holdout test set (never used during training/validation)

**Model Performance:**
- **Accuracy**: 97.78% (vs. 66.5% majority-class baseline)
- **AUC-ROC**: 0.972 (95% CI: 0.948-0.996)
- **AUC-PR**: 0.968
- **Precision**: 97.67% (for positive predictions - entrepreneurial action)
- **Recall**: 95.45%
- **Brier Score**: 0.045 (excellent calibration - predicted probabilities closely match observed outcomes)

### Variables (35 Total)
Organized into 10 categories:
1. **Personality** (2 variables)
2. **Self-Perception** (4 variables)
3. **Motivation** (3 variables)
4. **Intention** (2 variables)
5. **Social Capital** (6 variables)
6. **Competencies** (8 variables)
7. **Barriers** (3 variables)
8. **Context** (5 variables)
9. **Role Models** (2 variables)
10. **Experience** (1 variable)

## Installation & Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

```bash
# Deploy to GitHub Pages
npm run deploy
```

The application will be available at: `https://upocuantitativo.github.io/aibridgesGap/`

## Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Charts**: Recharts
- **Visualization**: D3.js, Canvas API
- **Model**: TensorFlow.js (for browser-based inference)
- **Styling**: CSS3 with custom properties

## Project Structure

```
web-app/
├── src/
│   ├── components/
│   │   ├── SensitivityAnalysis.jsx/css   # Main analysis interface
│   │   ├── NeuralNetworkVisualization.jsx/css # Network diagram
│   │   └── ChartsPanel.jsx/css           # Data visualizations
│   ├── data/
│   │   └── variablesDefinition.js        # Variable metadata & sources
│   ├── model/
│   │   └── neuralNetworkModel.js         # Neural network implementation
│   ├── App.jsx/css                       # Main application component
│   ├── main.jsx                          # Entry point
│   └── index.css                         # Global styles
├── public/                               # Static assets
├── index.html                            # HTML template
├── package.json                          # Dependencies
├── vite.config.js                        # Build configuration
└── README.md                             # Documentation
```

## Usage Guide

### Analyzing Entrepreneurial Potential

1. **Navigate to Model Analysis**: The default tab when you open the application
2. **Explore Variables**: Browse the 35 variables organized by category
3. **View Details**: Click any variable to expand and see survey questions and academic sources
4. **Adjust Values**: Use sliders to set values (1-5 scale) for each variable
5. **Watch Predictions Update**: The venture creation probability updates in real-time
6. **Review Recommendations**: Check the priority panel for suggested improvements
7. **Apply Suggestions**: Click "Apply Suggestion" to automatically set recommended values
8. **Analyze Visualizations**: Scroll down to view neural network and chart visualizations

### Understanding the Probability Display

- **Red colors (0-30%)**: Low probability of venture creation
- **Orange/Purple (30-70%)**: Moderate probability
- **Blue colors (70-100%)**: High probability of venture creation

### Interpreting Recommendations

Recommendations are sorted by **priority**, calculated based on:
- Variable importance in the model
- Current value vs optimal value gap
- Sensitivity (how much the probability changes with this variable)
- Potential impact on overall probability

## Academic Sources

All variables are grounded in peer-reviewed entrepreneurship research. Sources are visible when you expand each variable in the interface. Key references include:

- Liñán & Chen (2009) - Entrepreneurial Intentions
- Obschonka et al. (2012, 2015) - Identity and Self-Perception
- Santos et al. (2013) - Competencies and Attitudes
- Reynolds et al. (2005) - GEM Framework
- And many more...

## Contributing

This is a research project. For questions or suggestions, please contact the research team.

## License

Research use only. Please cite appropriately if using this tool in academic work.

## Contact

**Research Team**: UPO Cuantitativo
**Repository**: https://github.com/upocuantitativo/aibridgesGap

---

*Built with ❤️ for entrepreneurship research*
