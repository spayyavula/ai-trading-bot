import { Router, Request, Response } from 'express';
import { performanceService } from '@option-trading-platform/shared/api/services/performance';

const router = Router();

// Get performance data with benchmark comparison
router.get('/performance', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const performanceData = await performanceService.getBenchmarkData(
      startDate as string,
      endDate as string
    );

    res.json(performanceData);
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({ error: 'Failed to fetch performance data' });
  }
});

// Get performance metrics
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const performanceData = await performanceService.getBenchmarkData(
      startDate as string,
      endDate as string
    );

    const metrics = performanceService.calculateMetrics(performanceData);
    res.json(metrics);
  } catch (error) {
    console.error('Error calculating performance metrics:', error);
    res.status(500).json({ error: 'Failed to calculate performance metrics' });
  }
});

export default router; 