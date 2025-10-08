// Neural Network Model Configuration and Prediction
// Based on the optimal configuration: [50, 25, 12] architecture with RectifierWithDropout

export const MODEL_CONFIG = {
  architecture: [50, 25, 12],
  activation: 'RectifierWithDropout',
  inputDropout: 0.1,
  hiddenDropout: [0.3, 0.3, 0.3],
  l1: 1e-05,
  l2: 1e-04,
  learningRate: 0.005,
  earlyStoppingPatience: 10,
  seed: 12345
};

// Variable importance from the trained model (based on variables.png)
// These values represent the relative importance of each variable in prediction
export const VARIABLE_IMPORTANCE = {
  "A8_Intention_Implementation": 1.000000,
  "A7_Intention_Entrepreneurship": 0.867000,
  "A6_2_Mot_Pull_Lifestyle": 0.770000,
  "E7_2_Other_Role_Model": 0.655000,
  "A5_Self_Efficacy": 0.605000,
  "C3_Creativity": 0.580000,
  "D1_1_lack_personal_resources": 0.560000,
  "C6_Resources": 0.545000,
  "A4_Identity_Proccess": 0.530000,
  "D1_2_personal_fear_failure": 0.495000,
  "C1_Opportunities": 0.480000,
  "D5_UniversitySupport": 0.475000,
  "B5_Risk_Assumption": 0.465000,
  "A6_1_Mot_Pull_Oportunity": 0.460000,
  "A6_3_Mot_Push": 0.450000,
  "C4_Resilience": 0.440000,
  "A2_Selfesteem": 0.430000,
  "D6_Culture": 0.420000,
  "B3_Structural_Social_Capital": 0.410000,
  "B4_Relational_Social_Capital": 0.400000,
  "C8_Ambition": 0.390000,
  "G1_Experience": 0.380000,
  "C7_Proactivity": 0.375000,
  "D3_1_favourable_market": 0.370000,
  "C5_Leadership": 0.365000,
  "A1_1_Personality_Fem": 0.360000,
  "A1_2_Personality_Mas": 0.355000,
  "A3_Identity_Creation": 0.350000,
  "B6_Subjective_Norms": 0.345000,
  "C2_Persuasion": 0.340000,
  "D4_Regional_Support_0": 0.335000,
  "E7_1_Family_Role_model": 0.330000,
  "B7_Motivation_To_Comply": 0.325000,
  "D2_Regional_Barriers": 0.320000,
  "D3_2_Resources_Support": 0.315000,
  "B1_Entrepreneurial_Team": 0.310000
};

// Simulated weights for visualization (normalized)
// In a real implementation, these would come from the actual H2O model export
export class NeuralNetworkPredictor {
  constructor() {
    this.weights = this.initializeWeights();
    this.biases = this.initializeBiases();
  }

  initializeWeights() {
    // Simplified linear model based on variable importance
    // This ensures predictable min/max probability range

    const varNames = Object.keys(VARIABLE_IMPORTANCE);
    const layer1 = [];

    // Direct weighted connections - simple linear transformation
    // Each neuron focuses on different aspects of the input
    for (let i = 0; i < 50; i++) {
      const neuronWeights = [];
      for (let j = 0; j < 35; j++) {
        const varName = varNames[j];
        const importance = VARIABLE_IMPORTANCE[varName] || 0.1;

        // Barriers and fears have negative impact (inverse relationship)
        const isBarrier = varName.includes('lack_') || varName.includes('fear_') || varName === 'D2_Regional_Barriers';
        const sign = isBarrier ? -1 : 1;

        // Small weight scaled by importance - controlled variation
        const weight = sign * importance * 0.02 * (0.8 + Math.random() * 0.4);
        neuronWeights.push(weight);
      }
      layer1.push(neuronWeights);
    }

    // Simple propagation through layers
    const layer2 = [];
    for (let i = 0; i < 25; i++) {
      const neuronWeights = [];
      for (let j = 0; j < 50; j++) {
        neuronWeights.push(0.02 * (0.8 + Math.random() * 0.4));
      }
      layer2.push(neuronWeights);
    }

    const layer3 = [];
    for (let i = 0; i < 12; i++) {
      const neuronWeights = [];
      for (let j = 0; j < 25; j++) {
        neuronWeights.push(0.02 * (0.8 + Math.random() * 0.4));
      }
      layer3.push(neuronWeights);
    }

    // Output layer - positive weights
    const outputLayer = [];
    for (let j = 0; j < 12; j++) {
      outputLayer.push(0.083); // Equal contribution from each hidden neuron
    }

    return {
      layer1,
      layer2,
      layer3,
      output: outputLayer
    };
  }

  initializeBiases() {
    return {
      layer1: Array(50).fill(0),
      layer2: Array(25).fill(0),
      layer3: Array(12).fill(0),
      output: -1.1 // Adjusted for 25.2% - 81.8% range
    };
  }

  // Tanh activation function
  tanh(x) {
    return Math.tanh(x);
  }

  // Sigmoid for output layer - scaled to 25.2% - 81.8% range
  sigmoid(x) {
    const rawSigmoid = 1 / (1 + Math.exp(-x));
    // Map from [0, 1] to [0.252, 0.818]
    const minProb = 0.252;
    const maxProb = 0.818;
    return minProb + rawSigmoid * (maxProb - minProb);
  }

  // Forward pass through the network
  predict(inputValues) {
    // Normalize inputs (assuming 1-5 scale)
    const normalized = inputValues.map(x => (x - 3) / 2);

    // Layer 1: Input -> Hidden 1 (50 neurons)
    const hidden1 = [];
    for (let i = 0; i < 50; i++) {
      let sum = this.biases.layer1[i];
      for (let j = 0; j < 35; j++) {
        sum += normalized[j] * this.weights.layer1[i][j];
      }
      hidden1.push(this.tanh(sum));
    }

    // Layer 2: Hidden 1 -> Hidden 2 (25 neurons)
    const hidden2 = [];
    for (let i = 0; i < 25; i++) {
      let sum = this.biases.layer2[i];
      for (let j = 0; j < 50; j++) {
        sum += hidden1[j] * this.weights.layer2[i][j];
      }
      hidden2.push(this.tanh(sum));
    }

    // Layer 3: Hidden 2 -> Hidden 3 (12 neurons)
    const hidden3 = [];
    for (let i = 0; i < 12; i++) {
      let sum = this.biases.layer3[i];
      for (let j = 0; j < 25; j++) {
        sum += hidden2[j] * this.weights.layer3[i][j];
      }
      hidden3.push(this.tanh(sum));
    }

    // Output layer: Hidden 3 -> Output (1 neuron)
    let outputSum = this.biases.output;
    for (let j = 0; j < 12; j++) {
      outputSum += hidden3[j] * this.weights.output[j];
    }
    const probability = this.sigmoid(outputSum);

    return {
      probability,
      activations: {
        input: normalized,
        hidden1,
        hidden2,
        hidden3
      }
    };
  }

  // Calculate sensitivity: how much would probability change if we change one variable
  calculateSensitivity(currentValues, variableIndex, delta = 0.1) {
    const baseline = this.predict(currentValues).probability;

    const modifiedValues = [...currentValues];
    modifiedValues[variableIndex] += delta;

    const modified = this.predict(modifiedValues).probability;

    return (modified - baseline) / delta;
  }

  // Get recommendations: which variables to change to increase probability
  // Now considers both increasing AND decreasing values
  getRecommendations(currentValues, targetIncrease = 0.1) {
    const currentProb = this.predict(currentValues).probability;
    const recommendations = [];

    Object.keys(VARIABLE_IMPORTANCE).forEach((varName, index) => {
      const currentValue = currentValues[index];
      const importance = VARIABLE_IMPORTANCE[varName];

      // Test increasing the value (if not at max)
      if (currentValue < 5) {
        const increaseValue = Math.min(5, currentValue + 1);
        const testValuesIncrease = [...currentValues];
        testValuesIncrease[index] = increaseValue;
        const newProbIncrease = this.predict(testValuesIncrease).probability;
        const actualIncreaseUp = newProbIncrease - currentProb;

        if (actualIncreaseUp > 0.0001) { // Small threshold to avoid noise
          recommendations.push({
            variable: varName,
            currentValue,
            importance,
            potentialIncrease: actualIncreaseUp,
            suggestedValue: increaseValue,
            priority: importance * actualIncreaseUp * 100,
            direction: 'increase'
          });
        }
      }

      // Test decreasing the value (if not at min)
      if (currentValue > 1) {
        const decreaseValue = Math.max(1, currentValue - 1);
        const testValuesDecrease = [...currentValues];
        testValuesDecrease[index] = decreaseValue;
        const newProbDecrease = this.predict(testValuesDecrease).probability;
        const actualIncreaseDown = newProbDecrease - currentProb;

        if (actualIncreaseDown > 0.0001) { // Decreasing can increase probability!
          recommendations.push({
            variable: varName,
            currentValue,
            importance,
            potentialIncrease: actualIncreaseDown,
            suggestedValue: decreaseValue,
            priority: importance * actualIncreaseDown * 100,
            direction: 'decrease'
          });
        }
      }
    });

    // Sort by priority (highest impact first)
    recommendations.sort((a, b) => b.priority - a.priority);

    return recommendations;
  }

  // Get weights for a specific layer (for visualization)
  getLayerWeights(layerName) {
    return this.weights[layerName];
  }
}

// Create singleton instance
export const neuralNetwork = new NeuralNetworkPredictor();

// Helper function to get color based on probability (red to blue gradient)
export const getProbabilityColor = (probability) => {
  // Red (low probability) to Blue (high probability)
  const red = Math.round(255 * (1 - probability));
  const blue = Math.round(255 * probability);
  const green = Math.round(100 * Math.sin(probability * Math.PI)); // Slight green for middle values

  return `rgb(${red}, ${green}, ${blue})`;
};

// Helper function to format probability as percentage
export const formatProbability = (probability) => {
  return `${(probability * 100).toFixed(1)}%`;
};
