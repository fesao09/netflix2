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
const tmdbApiKey = process.env.TMDB_API_KEY || '5c66fecac3410a4da2709f1d944be38c'; // Usar variável de ambiente ou chave de fallback
const tmdbImageBaseUrl = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Document loaded');

  loadCategoryItems('filmes-assistidos');
  loadCategoryItems('filmes-para-assistir');
  loadCategoryItems('series-em-andamento');
  loadCategoryItems('series-assistidas');

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
          <img src="${tmdbImageBaseUrl}${item.poster_path}" alt="${item.title || item.name}">
          <h3>${item.title || item.name}</h3>
          <p>${item.release_date || item.first_air_date}</p>
          <button onclick="showCategoryModal('${item.title || item.name}', '${item.release_date || item.first_air_date}', '${tmdbImageBaseUrl}${item.poster_path}')">Adicionar</button>
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
});

function showCategoryModal(title, releaseDate, posterPath) {
  const modal = document.getElementById('category-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalReleaseDate = document.getElementById('modal-release-date');
  modalTitle.textContent = title;
  modalReleaseDate.textContent = releaseDate;
  modal.style.display = 'block';

  document.getElementById('add-to-category-btn').onclick = () => {
    const category = document.getElementById('category-select').value;
    console.log(`Adicionando ${title} à categoria ${category}`);
    addMovieToCategory(title, releaseDate, posterPath, category);
    modal.style.display = 'none';
  };
}

async function addMovieToCategory(title, releaseDate, posterPath, category) {
  try {
    const docRef = await db.collection(category).add({
      title: title,
      releaseYear: releaseDate.split('-')[0],
      posterPath: posterPath
    });
    console.log(`Filme/Série adicionada à categoria ${category} com ID: ${docRef.id}`);
    alert(`Filme/Série adicionada à categoria ${category} com ID: ${docRef.id}`);
    displayMovieInCategory(title, releaseDate, posterPath, category);
  } catch (error) {
    console.error('Error adding document: ', error);
    alert('Erro ao adicionar filme/série');
  }
}

function displayMovieInCategory(title, releaseDate, posterPath, category) {
  const categoryGrid = document.getElementById(category).querySelector('.movies-grid');
  const div = document.createElement('div');
  div.innerHTML = `
    <img src="${posterPath}" alt="${title}">
    <h3>${title}</h3>
    <p>${releaseDate}</p>
  `;
  categoryGrid.appendChild(div);
}

async function loadCategoryItems(category) {
  try {
    const querySnapshot = await db.collection(category).get();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      displayMovieInCategory(data.title, data.releaseYear, data.posterPath, category);
    });
  } catch (error) {
    console.error(`Error loading items for category ${category}: `, error);
  }
}

async function deleteMovie(id) {
  await fetch(`/delete/${id}`, { method: 'DELETE' });
  document.getElementById('search-btn').click();
}
