import * as tf from '@tensorflow/tfjs';
import { MarketData, MarketRegime } from './market-regime';

interface TrainingData {
  features: number[][];
  labels: number[];
}

interface CrossValidationResult {
  fold: number;
  trainAccuracy: number;
  validationAccuracy: number;
  trainLoss: number;
  validationLoss: number;
}

export class MLRegimePredictor {
  private model: tf.LayersModel | null = null;
  private readonly sequenceLength: number = 20;
  private readonly featureCount: number = 8;
  private readonly epochs: number = 50;
  private readonly batchSize: number = 32;
  private readonly numFolds: number = 5;

  constructor() {
    this.initializeModel();
  }

  private createModel(): tf.LayersModel {
    return tf.sequential({
      layers: [
        tf.layers.lstm({
          units: 64,
          returnSequences: true,
          inputShape: [this.sequenceLength, this.featureCount]
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.lstm({
          units: 32,
          returnSequences: false
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: 16,
          activation: 'relu'
        }),
        tf.layers.dense({
          units: 4, // Number of regimes
          activation: 'softmax'
        })
      ]
    });
  }

  private async initializeModel() {
    this.model = this.createModel();
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  private splitData(features: number[][], labels: number[], foldIndex: number): {
    trainFeatures: number[][];
    trainLabels: number[];
    valFeatures: number[][];
    valLabels: number[];
  } {
    const foldSize = Math.floor(features.length / this.numFolds);
    const startIdx = foldIndex * foldSize;
    const endIdx = startIdx + foldSize;

    const valFeatures = features.slice(startIdx, endIdx);
    const valLabels = labels.slice(startIdx, endIdx);
    const trainFeatures = [...features.slice(0, startIdx), ...features.slice(endIdx)];
    const trainLabels = [...labels.slice(0, startIdx), ...labels.slice(endIdx)];

    return { trainFeatures, trainLabels, valFeatures, valLabels };
  }

  private prepareFeatures(data: MarketData): number[][] {
    const features: number[][] = [];
    const { prices, volumes } = data;

    for (let i = this.sequenceLength; i < prices.length; i++) {
      const sequence = prices.slice(i - this.sequenceLength, i);
      const volumeSequence = volumes.slice(i - this.sequenceLength, i);
      
      // Calculate technical indicators for the sequence
      const returns = sequence.slice(1).map((price, j) => (price - sequence[j]) / sequence[j]);
      const volatility = this.calculateVolatility(returns);
      const momentum = this.calculateMomentum(sequence);
      const volumeTrend = this.calculateVolumeTrend(volumeSequence);
      const rsi = this.calculateRSI(sequence);
      const macd = this.calculateMACD(sequence);
      const bb = this.calculateBollingerBands(sequence);
      const trend = this.calculateTrendStrength(sequence);

      features.push([
        volatility,
        momentum,
        volumeTrend,
        rsi,
        macd,
        bb,
        trend,
        returns[returns.length - 1]
      ]);
    }

    return features;
  }

  private prepareLabels(regimes: MarketRegime[]): number[] {
    return regimes.map(regime => {
      switch (regime.regime) {
        case 'bullish': return 0;
        case 'bearish': return 1;
        case 'neutral': return 2;
        case 'volatile': return 3;
        default: return 2;
      }
    });
  }

  private calculateVolatility(returns: number[]): number {
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  private calculateMomentum(prices: number[]): number {
    return (prices[prices.length - 1] - prices[0]) / prices[0];
  }

  private calculateVolumeTrend(volumes: number[]): number {
    const mean = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    return volumes[volumes.length - 1] / mean;
  }

  private calculateRSI(prices: number[]): number {
    const gains = prices.slice(1).map((price, i) => Math.max(0, price - prices[i]));
    const losses = prices.slice(1).map((price, i) => Math.max(0, prices[i] - price));
    const avgGain = gains.reduce((a, b) => a + b, 0) / gains.length;
    const avgLoss = losses.reduce((a, b) => a + b, 0) / losses.length;
    return 100 - (100 / (1 + avgGain / avgLoss));
  }

  private calculateMACD(prices: number[]): number {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    return ema12 - ema26;
  }

  private calculateEMA(prices: number[], period: number): number {
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }
    return ema;
  }

  private calculateBollingerBands(prices: number[]): number {
    const sma = prices.reduce((a, b) => a + b, 0) / prices.length;
    const std = Math.sqrt(
      prices.reduce((a, b) => a + Math.pow(b - sma, 2), 0) / prices.length
    );
    return (prices[prices.length - 1] - sma) / (2 * std);
  }

  private calculateTrendStrength(prices: number[]): number {
    const returns = prices.slice(1).map((price, i) => (price - prices[i]) / prices[i]);
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const std = Math.sqrt(
      returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length
    );
    return mean / std;
  }

  async performCrossValidation(historicalData: MarketData[], historicalRegimes: MarketRegime[]): Promise<CrossValidationResult[]> {
    const features = this.prepareFeatures(historicalData[0]);
    const labels = this.prepareLabels(historicalRegimes);
    const results: CrossValidationResult[] = [];

    for (let fold = 0; fold < this.numFolds; fold++) {
      console.log(`Training fold ${fold + 1}/${this.numFolds}`);
      
      const { trainFeatures, trainLabels, valFeatures, valLabels } = this.splitData(features, labels, fold);
      
      // Create and compile model for this fold
      const foldModel = this.createModel();
      foldModel.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      // Convert data to tensors
      const trainXs = tf.tensor3d(trainFeatures.map(f => f.map(x => [x])));
      const trainYs = tf.oneHot(tf.tensor1d(trainLabels, 'int32'), 4);
      const valXs = tf.tensor3d(valFeatures.map(f => f.map(x => [x])));
      const valYs = tf.oneHot(tf.tensor1d(valLabels, 'int32'), 4);

      // Train the model
      const history = await foldModel.fit(trainXs, trainYs, {
        epochs: this.epochs,
        batchSize: this.batchSize,
        validationData: [valXs, valYs],
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Fold ${fold + 1}, Epoch ${epoch + 1}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}`);
          }
        }
      });

      // Get final metrics
      const trainMetrics = history.history;
      const result: CrossValidationResult = {
        fold: fold + 1,
        trainAccuracy: trainMetrics.acc[trainMetrics.acc.length - 1],
        validationAccuracy: trainMetrics.val_acc[trainMetrics.val_acc.length - 1],
        trainLoss: trainMetrics.loss[trainMetrics.loss.length - 1],
        validationLoss: trainMetrics.val_loss[trainMetrics.val_loss.length - 1]
      };

      results.push(result);

      // Cleanup tensors
      trainXs.dispose();
      trainYs.dispose();
      valXs.dispose();
      valYs.dispose();
      foldModel.dispose();
    }

    // Calculate and log average metrics
    const avgTrainAccuracy = results.reduce((sum, r) => sum + r.trainAccuracy, 0) / this.numFolds;
    const avgValAccuracy = results.reduce((sum, r) => sum + r.validationAccuracy, 0) / this.numFolds;
    const avgTrainLoss = results.reduce((sum, r) => sum + r.trainLoss, 0) / this.numFolds;
    const avgValLoss = results.reduce((sum, r) => sum + r.validationLoss, 0) / this.numFolds;

    console.log('\nCross-validation Results:');
    console.log(`Average Training Accuracy: ${(avgTrainAccuracy * 100).toFixed(2)}%`);
    console.log(`Average Validation Accuracy: ${(avgValAccuracy * 100).toFixed(2)}%`);
    console.log(`Average Training Loss: ${avgTrainLoss.toFixed(4)}`);
    console.log(`Average Validation Loss: ${avgValLoss.toFixed(4)}`);

    return results;
  }

  async train(historicalData: MarketData[], historicalRegimes: MarketRegime[]): Promise<void> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const features = this.prepareFeatures(historicalData[0]);
    const labels = this.prepareLabels(historicalRegimes);

    const xs = tf.tensor3d(features.map(f => f.map(x => [x])));
    const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), 4);

    await this.model.fit(xs, ys, {
      epochs: this.epochs,
      batchSize: this.batchSize,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}`);
        }
      }
    });

    xs.dispose();
    ys.dispose();
  }

  async predict(data: MarketData): Promise<MarketRegime> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const features = this.prepareFeatures(data);
    const lastSequence = features[features.length - 1];
    const input = tf.tensor3d([lastSequence.map(x => [x])]);

    const prediction = await this.model.predict(input) as tf.Tensor;
    const probabilities = await prediction.data();
    const regimeIndex = probabilities.indexOf(Math.max(...probabilities));

    const regimes: MarketRegime['regime'][] = ['bullish', 'bearish', 'neutral', 'volatile'];
    const confidence = probabilities[regimeIndex];

    input.dispose();
    prediction.dispose();

    return {
      regime: regimes[regimeIndex],
      confidence,
      indicators: {
        trend: lastSequence[6],
        momentum: lastSequence[1],
        volatility: lastSequence[0],
        volume: lastSequence[2]
      }
    };
  }

  async saveModel(path: string): Promise<void> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }
    await this.model.save(`file://${path}`);
  }

  async loadModel(path: string): Promise<void> {
    this.model = await tf.loadLayersModel(`file://${path}`);
  }
} 