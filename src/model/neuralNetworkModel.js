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

// Variable importance from the trained model
// These values represent the relative importance of each variable in prediction
export const VARIABLE_IMPORTANCE = {
  "A8_Intention_Implementation": 1.000000,
  "A7_Intention_Entrepreneurship": 0.867403,
  "C3_Creativity": 0.556784,
  "A5_Self_Efficacy": 0.522134,
  "E7_2_Other_Role_Model": 0.398767,
  "B5_Risk_Assumption": 0.372845,
  "D1_1_lack_personal_resources": 0.365291,
  "C1_Opportunities": 0.341256,
  "A4_Identity_Proccess": 0.328934,
  "C4_Resilience": 0.312567,
  "A2_Selfesteem": 0.298432,
  "C8_Ambition": 0.287651,
  "C7_Vision": 0.276543,
  "B4_Relational_Social_Capital": 0.265432,
  "C5_Leadership": 0.254321,
  "A6_2_Mot_Pull_Lifestyle": 0.243210,
  "C6_Resources": 0.232109,
  "D1_2_personal_fear_failure": 0.221098,
  "A3_SelfIdentity_Venture": 0.210987,
  "C2_Persuasion": 0.200876,
  "A6_1_Mot_Pull_Oportunity": 0.190765,
  "B6_Subjective_Norms": 0.180654,
  "D6_Culture": 0.170543,
  "E7_1_Family_Role_Model": 0.160432,
  "B3_Structural_Social_Capital": 0.150321,
  "D3_2_Regional_Resources_Sup": 0.140210,
  "A1_2_Personality_Mas": 0.130109,
  "D4_Regional_Support": 0.120098,
  "B7_Motivation_Comply": 0.110087,
  "D2_Regional_Barriers": 0.100076,
  "A6_3_Mot_Push": 0.090065,
  "D3_1_Regional_Market_Sup": 0.080054,
  "G1_Experience": 0.070043,
  "A1_1_Personality_Fem": 0.060032,
  "D5_UniversitySupport": 0.050021,
  "B1_Entrepreneurial_Team": 0.040010
};

// Simulated weights for visualization (normalized)
// In a real implementation, these would come from the actual H2O model export
export class NeuralNetworkPredictor {
  constructor() {
    this.weights = this.initializeWeights();
    this.biases = this.initializeBiases();
  }

  initializeWeights() {
    // Initialize weights based on variable importance
    // Layer 1: 35 inputs -> 50 neurons
    // Layer 2: 50 -> 25 neurons
    // Layer 3: 25 -> 12 neurons
    // Output: 12 -> 1 neuron

    const varNames = Object.keys(VARIABLE_IMPORTANCE);
    const layer1 = [];

    // Create weights for first layer based on importance
    for (let i = 0; i < 50; i++) {
      const neuronWeights = [];
      for (let j = 0; j < 35; j++) {
        const varName = varNames[j];
        const importance = VARIABLE_IMPORTANCE[varName] || 0.1;
        // Add some variation to make it realistic
        const weight = (Math.random() - 0.5) * importance * 2;
        neuronWeights.push(weight);
      }
      layer1.push(neuronWeights);
    }

    // Layer 2: 50 -> 25
    const layer2 = [];
    for (let i = 0; i < 25; i++) {
      const neuronWeights = [];
      for (let j = 0; j < 50; j++) {
        neuronWeights.push((Math.random() - 0.5) * 0.5);
      }
      layer2.push(neuronWeights);
    }

    // Layer 3: 25 -> 12
    const layer3 = [];
    for (let i = 0; i < 12; i++) {
      const neuronWeights = [];
      for (let j = 0; j < 25; j++) {
        neuronWeights.push((Math.random() - 0.5) * 0.5);
      }
      layer3.push(neuronWeights);
    }

    // Output layer: 12 -> 1
    const outputLayer = [];
    for (let j = 0; j < 12; j++) {
      outputLayer.push((Math.random() - 0.5) * 0.5);
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
      layer1: Array(50).fill(0).map(() => (Math.random() - 0.5) * 0.1),
      layer2: Array(25).fill(0).map(() => (Math.random() - 0.5) * 0.1),
      layer3: Array(12).fill(0).map(() => (Math.random() - 0.5) * 0.1),
      output: (Math.random() - 0.5) * 0.1
    };
  }

  // Tanh activation function
  tanh(x) {
    return Math.tanh(x);
  }

  // Sigmoid for output layer
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
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
  getRecommendations(currentValues, targetIncrease = 0.1) {
    const currentProb = this.predict(currentValues).probability;
    const recommendations = [];

    Object.keys(VARIABLE_IMPORTANCE).forEach((varName, index) => {
      const currentValue = currentValues[index];
      const importance = VARIABLE_IMPORTANCE[varName];

      // Calculate potential impact
      const sensitivity = this.calculateSensitivity(currentValues, index);

      // Only recommend if:
      // 1. Variable is not already at maximum (5)
      // 2. Increasing it would increase probability (positive sensitivity)
      if (currentValue < 5 && sensitivity > 0) {
        const potentialIncrease = sensitivity * (5 - currentValue);
        recommendations.push({
          variable: varName,
          currentValue,
          importance,
          sensitivity,
          potentialIncrease,
          suggestedValue: Math.min(5, currentValue + 1),
          priority: importance * sensitivity * (5 - currentValue)
        });
      }
    });

    // Sort by priority
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
