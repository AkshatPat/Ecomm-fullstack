// src/index.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/routes';
import { exampleMiddleware } from './middlewares/example';
import path from 'path';

const app = express();

app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(cors(
  {
    origin: "*"
  }
))

// Middleware
app.use(bodyParser.json());
// app.use(cors());

// Apply the logging middleware to all routes
app.use(exampleMiddleware);

// API Routes
app.use('/api/', routes);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
