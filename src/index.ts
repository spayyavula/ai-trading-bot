import express from 'express';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AI Trading Bot API',
    version: '1.0.0',
    status: 'running'
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 