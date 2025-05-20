import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MarketRegime } from '@option-trading-platform/risk-management';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Container = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  margin: 0 0 20px 0;
  color: #fff;
`;

const ChartContainer = styled.div`
  position: relative;
  height: 300px;
  margin-bottom: 20px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const Metric = styled.div`
  background: #2a2a2a;
  padding: 15px;
  border-radius: 4px;
`;

const MetricLabel = styled.div`
  color: #888;
  font-size: 0.9em;
  margin-bottom: 5px;
`;

const MetricValue = styled.div<{ value: number }>`
  color: ${props => {
    if (props.value > 0.7) return '#4caf50';
    if (props.value > 0.3) return '#ff9800';
    return '#f44336';
  }};
  font-size: 1.2em;
  font-weight: bold;
`;

interface RegimeAnalysisProps {
  historicalData: {
    timestamps: string[];
    prices: number[];
    regimes: MarketRegime[];
  };
}

const RegimeAnalysis: React.FC<RegimeAnalysisProps> = ({ historicalData }) => {
  const chartRef = useRef<ChartJS>(null);

  const getRegimeColor = (regime: MarketRegime['regime']): string => {
    switch (regime) {
      case 'bullish': return '#4caf50';
      case 'bearish': return '#f44336';
      case 'neutral': return '#ff9800';
      case 'volatile': return '#9c27b0';
      default: return '#888';
    }
  };

  const chartData: ChartData<'line'> = {
    labels: historicalData.timestamps,
    datasets: [
      {
        label: 'Price',
        data: historicalData.prices,
        borderColor: '#2962ff',
        backgroundColor: 'rgba(41, 98, 255, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex;
            const regime = historicalData.regimes[index];
            return [
              `Price: $${context.raw.toFixed(2)}`,
              `Regime: ${regime.regime}`,
              `Confidence: ${(regime.confidence * 100).toFixed(1)}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#888'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#888'
        }
      }
    }
  };

  const calculateRegimeMetrics = () => {
    const regimeCounts = historicalData.regimes.reduce((acc, regime) => {
      acc[regime.regime] = (acc[regime.regime] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalPeriods = historicalData.regimes.length;
    const avgConfidence = historicalData.regimes.reduce((sum, regime) => sum + regime.confidence, 0) / totalPeriods;

    const regimeTransitions = historicalData.regimes.reduce((acc, regime, i) => {
      if (i > 0) {
        const prevRegime = historicalData.regimes[i - 1].regime;
        const key = `${prevRegime}->${regime.regime}`;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      regimeDistribution: regimeCounts,
      averageConfidence: avgConfidence,
      regimeTransitions
    };
  };

  const metrics = calculateRegimeMetrics();

  return (
    <Container>
      <Title>Historical Regime Analysis</Title>
      
      <ChartContainer>
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </ChartContainer>

      <MetricsGrid>
        <Metric>
          <MetricLabel>Regime Distribution</MetricLabel>
          {Object.entries(metrics.regimeDistribution).map(([regime, count]) => (
            <div key={regime} style={{ color: getRegimeColor(regime as MarketRegime['regime']) }}>
              {regime}: {((count / historicalData.regimes.length) * 100).toFixed(1)}%
            </div>
          ))}
        </Metric>

        <Metric>
          <MetricLabel>Average Confidence</MetricLabel>
          <MetricValue value={metrics.averageConfidence}>
            {(metrics.averageConfidence * 100).toFixed(1)}%
          </MetricValue>
        </Metric>

        <Metric>
          <MetricLabel>Most Common Transitions</MetricLabel>
          {Object.entries(metrics.regimeTransitions)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([transition, count]) => (
              <div key={transition}>
                {transition}: {count} times
              </div>
            ))}
        </Metric>
      </MetricsGrid>
    </Container>
  );
};

export default RegimeAnalysis; 