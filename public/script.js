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

console.log('Firebase initialized:', firebaseConfig);

// TMDB configuration
const tmdbApiKey = '5c66fecac3410a4da2709f1d944be38c'; // Substitua por sua chave de API do TMDB

document.getElementById('search-btn').addEventListener('click', async () => {
  const query = document.getElementById('search-input').value;
  const resultsGrid = document.getElementById('results-grid');
  resultsGrid.innerHTML = '';

  console.log(`Buscando por: ${query}`);

  // Buscar filmes e séries do TMDB ordenados pelos mais recentes
  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&query=${query}&sort_by=release_date.desc`);
    const data = await response.json();

    console.log('Resultados da busca:', data);

    data.results.forEach((item) => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h3>${item.title || item.name}</h3>
        <p>${item.release_date || item.first_air_date}</p>
        <button onclick="addMovie('${item.title || item.name}', '${item.release_date || item.first_air_date}')">Adicionar</button>
      `;
      resultsGrid.appendChild(div);
    });

    document.getElementById('search-results').classList.remove('hidden');
  } catch (error) {
    console.error('Erro ao buscar dados do TMDB:', error);
  }
});

document.getElementById('clear-btn').addEventListener('click', () => {
  document.getElementById('search-input').value = '';
  document.getElementById('results-grid').innerHTML = '';
  document.getElementById('search-results').classList.add('hidden');
});

async function addMovie(title, releaseDate) {
  try {
    const docRef = await db.collection('movies').add({
      title: title,
      releaseYear: releaseDate.split('-')[0]
    });
    alert(`Filme/Série adicionada com ID: ${docRef.id}`);
  } catch (error) {
    console.error('Error adding document: ', error);
    alert('Erro ao adicionar filme/série');
  }
}

async function deleteMovie(id) {
  await fetch(`/delete/${id}`, { method: 'DELETE' });
  document.getElementById('search-btn').click();
}
