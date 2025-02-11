import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors()); // To allow cross-origin requests from Angular frontend

// Registration endpoint
app.post('/api/register', (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  console.log('Received registration data:', req.body);

  // Dummy response, replace with actual logic (e.g., saving to database)
  if (firstname && lastname && email && password) {
    res.status(200).send({ message: 'Registration successful' });
  } else {
    res.status(400).send({ message: 'Invalid data' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
