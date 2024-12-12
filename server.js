const express = require('express');
const path = require('path');
const firebase = require('firebase/app');
require('firebase/firestore');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Verificar se as variáveis de ambiente estão definidas
if (!process.env.FIREBASE_API_KEY || !process.env.FIREBASE_AUTH_DOMAIN || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_STORAGE_BUCKET || !process.env.FIREBASE_MESSAGING_SENDER_ID || !process.env.FIREBASE_APP_ID) {
  console.error('Variáveis de ambiente do Firebase não estão definidas');
  process.exit(1);
}

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
try {
  if (firebase && firebase.apps && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
} catch (error) {
  console.error('Erro ao inicializar o Firebase:', error);
  process.exit(1);
}

const db = firebase.firestore ? firebase.firestore() : null;

if (!db) {
  console.error('Erro ao inicializar o Firestore');
  process.exit(1);
}

// Log environment details
console.log('Environment:', process.env);

// Middleware para analisar o corpo da requisição
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Example route to add data to Firestore
app.post('/add', async (req, res) => {
  try {
    if (!req.body || !req.body.title || !req.body.director || !req.body.releaseYear) {
      return res.status(400).send('Missing required fields');
    }
    const docRef = await db.collection('movies').add({
      title: req.body.title,
      director: req.body.director,
      releaseYear: req.body.releaseYear
    });
    res.status(200).send(`Document added with ID: ${docRef.id}`);
  } catch (error) {
    console.error('Error adding document: ', error);
    res.status(500).send('Error adding document');
  }
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
