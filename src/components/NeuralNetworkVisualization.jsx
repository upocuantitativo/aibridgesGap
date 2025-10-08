import React, { useEffect, useRef, useState } from 'react';
import { MODEL_CONFIG } from '../model/neuralNetworkModel';
import './NeuralNetworkVisualization.css';

const NeuralNetworkVisualization = ({ activations, weights }) => {
  const canvasRef = useRef(null);
  const [hoveredNeuron, setHoveredNeuron] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    drawNetwork(ctx, canvas.width, canvas.height);
  }, [activations, weights, hoveredNeuron]);

  const drawNetwork = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height);

    const layers = [
      { neurons: 35, label: 'Input\n(35 variables)' },
      { neurons: 50, label: 'Hidden 1\n(50 neurons)' },
      { neurons: 25, label: 'Hidden 2\n(25 neurons)' },
      { neurons: 12, label: 'Hidden 3\n(12 neurons)' },
      { neurons: 1, label: 'Output\n(Probability)' }
    ];

    const layerSpacing = width / (layers.length + 1);
    const maxNeurons = Math.max(...layers.map(l => l.neurons));

    // Draw connections first (behind neurons)
    for (let l = 0; l < layers.length - 1; l++) {
      const currentLayer = layers[l];
      const nextLayer = layers[l + 1];

      const x1 = layerSpacing * (l + 1);
      const x2 = layerSpacing * (l + 2);

      // Sample connections (not all, to avoid clutter)
      const sampleRate = Math.max(1, Math.floor(currentLayer.neurons / 10));

      for (let i = 0; i < currentLayer.neurons; i += sampleRate) {
        const y1 = (height / (currentLayer.neurons + 1)) * (i + 1);

        for (let j = 0; j < nextLayer.neurons; j += Math.max(1, Math.floor(nextLayer.neurons / 5))) {
          const y2 = (height / (nextLayer.neurons + 1)) * (j + 1);

          // Weight-based opacity (simulated)
          const weight = Math.random();
          const opacity = Math.abs(weight) * 0.3;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = weight > 0
            ? `rgba(102, 126, 234, ${opacity})`
            : `rgba(234, 102, 102, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw neurons
    layers.forEach((layer, layerIndex) => {
      const x = layerSpacing * (layerIndex + 1);
      const neuronSpacing = height / (layer.neurons + 1);

      // Display sample neurons (not all for large layers)
      const displayCount = Math.min(layer.neurons, 20);
      const step = layer.neurons > displayCount ? Math.floor(layer.neurons / displayCount) : 1;

      for (let i = 0; i < layer.neurons; i += step) {
        const y = neuronSpacing * (i + 1);

        // Get activation value if available
        let activation = 0.5;
        if (activations) {
          if (layerIndex === 0 && activations.input) {
            activation = (activations.input[i] + 1) / 2; // Normalize from [-1,1] to [0,1]
          } else if (layerIndex === 1 && activations.hidden1) {
            activation = (activations.hidden1[i] + 1) / 2;
          } else if (layerIndex === 2 && activations.hidden2) {
            activation = (activations.hidden2[i] + 1) / 2;
          } else if (layerIndex === 3 && activations.hidden3) {
            activation = (activations.hidden3[i] + 1) / 2;
          }
        }

        // Draw neuron circle
        const radius = layerIndex === 0 || layerIndex === 4 ? 6 : 5;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);

        // Color based on activation
        const blue = Math.round(102 + (activation * 153));
        const red = Math.round(234 - (activation * 132));
        ctx.fillStyle = `rgb(${red}, 100, ${blue})`;

        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw layer label
      ctx.fillStyle = '#333';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      const lines = layer.label.split('\n');
      lines.forEach((line, idx) => {
        ctx.fillText(line, x, height - 30 + (idx * 15));
      });
    });

    // Draw activation function label
    ctx.fillStyle = '#667eea';
    ctx.font = 'italic 11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('RectifierWithDropout Activation', width / 2, 25);
  };

  return (
    <div className="neural-network-viz">
      <h3>Neural Network Architecture</h3>
      <div className="architecture-info">
        <div className="info-item">
          <strong>Architecture:</strong> [50, 25, 12] (87 hidden neurons)
        </div>
        <div className="info-item">
          <strong>Activation:</strong> {MODEL_CONFIG.activation}
        </div>
        <div className="info-item">
          <strong>Learning Rate:</strong> {MODEL_CONFIG.learningRate}
        </div>
        <div className="info-item">
          <strong>Dropout:</strong> Input: {MODEL_CONFIG.inputDropout}, Hidden: [{MODEL_CONFIG.hiddenDropout.join(', ')}]
        </div>
        <div className="info-item">
          <strong>Regularization:</strong> L1={MODEL_CONFIG.l1}, L2={MODEL_CONFIG.l2}
        </div>
        <div className="info-item">
          <strong>Early Stopping:</strong> Patience {MODEL_CONFIG.earlyStoppingPatience} epochs
        </div>
      </div>

      <div className="canvas-container">
        <canvas ref={canvasRef} className="network-canvas" />
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ background: 'rgb(234, 100, 102)' }}></div>
          <span>Low Activation</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: 'rgb(150, 100, 180)' }}></div>
          <span>Medium Activation</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: 'rgb(102, 100, 255)' }}></div>
          <span>High Activation</span>
        </div>
      </div>
    </div>
  );
};

export default NeuralNetworkVisualization;
