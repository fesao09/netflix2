// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDs877-qqhixjzOtODzNEe66zJjRgG0ho0",
  authDomain: "netflix2-40dbe.firebaseapp.com",
  projectId: "netflix2-40dbe",
  storageBucket: "netflix2-40dbe.appspot.com",
  messagingSenderId: "272948667951",
  appId: "1:272948667951:web:eb84b6fd3327eaacaa08da",
  measurementId: "G-D8ZQWFDDWT"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById('search-btn').addEventListener('click', async () => {
  const query = document.getElementById('search-input').value;
  const resultsGrid = document.getElementById('results-grid');
  resultsGrid.innerHTML = '';
  const querySnapshot = await db.collection('movies').where('title', '==', query).get();
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.director}</p>
      <p>${data.releaseYear}</p>
      <button onclick="deleteMovie('${doc.id}')">Excluir</button>
    `;
    resultsGrid.appendChild(div);
  });
  document.getElementById('search-results').classList.remove('hidden');
});

document.getElementById('clear-btn').addEventListener('click', () => {
  document.getElementById('search-input').value = '';
  document.getElementById('results-grid').innerHTML = '';
  document.getElementById('search-results').classList.add('hidden');
});

async function deleteMovie(id) {
  await fetch(`/delete/${id}`, { method: 'DELETE' });
  document.getElementById('search-btn').click();
}
