import React, { useEffect, useState } from 'react';
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
  ChartData,
  ChartOptions
} from 'chart.js';
import styled from 'styled-components';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceData {
  timestamp: string;
  traderPerformance: number;
  sp500Performance: number;
  nasdaqPerformance: number;
  dowPerformance: number;
}

interface PerformanceBenchmarkProps {
  startDate: string;
  endDate: string;
}

const Container = styled.div`
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const ChartContainer = styled.div`
  height: 400px;
  margin-bottom: 20px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const Metric = styled.div`
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
`;

const MetricLabel = styled.div`
  font-weight: 600;
  color: #666;
  margin-bottom: 5px;
`;

const MetricValue = styled.div<{ value: number }>`
  font-size: 1.2em;
  color: ${props => props.value >= 0 ? '#28a745' : '#dc3545'};
`;

const PerformanceBenchmark: React.FC<PerformanceBenchmarkProps> = ({ startDate, endDate }) => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [metrics, setMetrics] = useState({
    traderReturn: 0,
    sp500Return: 0,
    nasdaqReturn: 0,
    dowReturn: 0,
    outperformance: 0,
    sharpeRatio: 0,
    maxDrawdown: 0
  });

  useEffect(() => {
    // Fetch performance data
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/analytics/performance?startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();
        setPerformanceData(data);
        calculateMetrics(data);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const calculateMetrics = (data: PerformanceData[]) => {
    if (data.length === 0) return;

    const calculateReturn = (values: number[]) => {
      const startValue = values[0];
      const endValue = values[values.length - 1];
      return ((endValue - startValue) / startValue) * 100;
    };

    const calculateSharpeRatio = (returns: number[]) => {
      const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      const stdDev = Math.sqrt(
        returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length
      );
      return avgReturn / stdDev;
    };

    const calculateMaxDrawdown = (values: number[]) => {
      let maxDrawdown = 0;
      let peak = values[0];

      for (const value of values) {
        if (value > peak) {
          peak = value;
        }
        const drawdown = (peak - value) / peak;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
      }

      return maxDrawdown * 100;
    };

    const traderReturn = calculateReturn(data.map(d => d.traderPerformance));
    const sp500Return = calculateReturn(data.map(d => d.sp500Performance));
    const nasdaqReturn = calculateReturn(data.map(d => d.nasdaqPerformance));
    const dowReturn = calculateReturn(data.map(d => d.dowPerformance));

    const traderReturns = data.map((d, i) => 
      i > 0 ? (d.traderPerformance - data[i-1].traderPerformance) / data[i-1].traderPerformance : 0
    );

    setMetrics({
      traderReturn,
      sp500Return,
      nasdaqReturn,
      dowReturn,
      outperformance: traderReturn - sp500Return,
      sharpeRatio: calculateSharpeRatio(traderReturns),
      maxDrawdown: calculateMaxDrawdown(data.map(d => d.traderPerformance))
    });
  };

  const chartData: ChartData<'line'> = {
    labels: performanceData.map(d => d.timestamp),
    datasets: [
      {
        label: 'Trader Performance',
        data: performanceData.map(d => d.traderPerformance),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4
      },
      {
        label: 'S&P 500',
        data: performanceData.map(d => d.sp500Performance),
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.4
      },
      {
        label: 'NASDAQ',
        data: performanceData.map(d => d.nasdaqPerformance),
        borderColor: '#ffc107',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        tension: 0.4
      },
      {
        label: 'Dow Jones',
        data: performanceData.map(d => d.dowPerformance),
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance Comparison'
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Performance (%)'
        }
      }
    }
  };

  return (
    <Container>
      <Title>Performance Benchmarking</Title>
      
      <ChartContainer>
        <Line data={chartData} options={chartOptions} />
      </ChartContainer>

      <MetricsGrid>
        <Metric>
          <MetricLabel>Trader Return</MetricLabel>
          <MetricValue value={metrics.traderReturn}>
            {metrics.traderReturn.toFixed(2)}%
          </MetricValue>
        </Metric>

        <Metric>
          <MetricLabel>S&P 500 Return</MetricLabel>
          <MetricValue value={metrics.sp500Return}>
            {metrics.sp500Return.toFixed(2)}%
          </MetricValue>
        </Metric>

        <Metric>
          <MetricLabel>NASDAQ Return</MetricLabel>
          <MetricValue value={metrics.nasdaqReturn}>
            {metrics.nasdaqReturn.toFixed(2)}%
          </MetricValue>
        </Metric>

        <Metric>
          <MetricLabel>Dow Jones Return</MetricLabel>
          <MetricValue value={metrics.dowReturn}>
            {metrics.dowReturn.toFixed(2)}%
          </MetricValue>
        </Metric>

        <Metric>
          <MetricLabel>Outperformance vs S&P 500</MetricLabel>
          <MetricValue value={metrics.outperformance}>
            {metrics.outperformance.toFixed(2)}%
          </MetricValue>
        </Metric>

        <Metric>
          <MetricLabel>Sharpe Ratio</MetricLabel>
          <MetricValue value={metrics.sharpeRatio}>
            {metrics.sharpeRatio.toFixed(2)}
          </MetricValue>
        </Metric>

        <Metric>
          <MetricLabel>Maximum Drawdown</MetricLabel>
          <MetricValue value={-metrics.maxDrawdown}>
            {metrics.maxDrawdown.toFixed(2)}%
          </MetricValue>
        </Metric>
      </MetricsGrid>
    </Container>
  );
};

export default PerformanceBenchmark; 