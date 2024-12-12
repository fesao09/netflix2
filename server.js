const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Log environment details
console.log('Environment:', process.env);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.message);
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Log request details
app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  console.log('Request Method:', req.method);
  next();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
