const API_KEY = '5c66fecac3410a4da2709f1d944be38c'; // Substitua pela chave da API
const BASE_URL = 'https://api.themoviedb.org/3';

document.getElementById('search-btn').addEventListener('click', function() {
  const query = document.getElementById('search-input').value;
  searchMoviesAndTVShows(query);
});

document.getElementById('clear-btn').addEventListener('click', function() {
  clearResults();
});

function searchMoviesAndTVShows(query) {
  const currentDate = new Date().toISOString().split('T')[0];
  const movieSearchUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&primary_release_date.lte=${currentDate}`;
  const tvSearchUrl = `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${query}&first_air_date.lte=${currentDate}`;

  Promise.all([
    fetch(movieSearchUrl).then(response => response.json()),
    fetch(tvSearchUrl).then(response => response.json())
  ])
  .then(([movieData, tvData]) => {
    const movieResults = movieData.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      img: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      type: 'movie'
    }));
    const tvResults = tvData.results.map(tvShow => ({
      id: tvShow.id,
      title: tvShow.name,
      img: `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`,
      type: 'tv'
    }));
    displayResults([...movieResults, ...tvResults]);
  })
  .catch(error => console.error('Error:', error));
}

function displayResults(results) {
  const resultsGrid = document.getElementById('results-grid');
  const searchResultsSection = document.getElementById('search-results');
  resultsGrid.innerHTML = '';
  if (results.length > 0) {
    searchResultsSection.classList.remove('hidden');
    results.forEach(result => {
      const div = document.createElement('div');
      div.innerHTML = `<img src="${result.img}" alt="${result.title}"><p>${result.title}</p>`;
      div.addEventListener('click', () => categorizeMovie(result));
      resultsGrid.appendChild(div);
    });
  } else {
    searchResultsSection.classList.add('hidden');
  }
}

function categorizeMovie(movie) {
  const category = prompt('Escolha a categoria: 1. Filmes Assistidos, 2. Filmes para Assistir, 3. Séries em Andamento, 4. Séries Assistidas');
  let categoryDiv;
  switch (category) {
    case '1':
      categoryDiv = document.querySelector('#filmes-assistidos .movies-grid');
      break;
    case '2':
      categoryDiv = document.querySelector('#filmes-para-assistir .movies-grid');
      break;
    case '3':
      categoryDiv = document.querySelector('#series-em-andamento .movies-grid');
      break;
    case '4':
      categoryDiv = document.querySelector('#series-assistidas .movies-grid');
      break;
    default:
      alert('Categoria inválida');
      return;
  }
  const div = document.createElement('div');
  div.innerHTML = `<img src="${movie.img}" alt="${movie.title}"><p>${movie.title}</p>`;
  div.addEventListener('click', () => showDetails(movie));
  categoryDiv.appendChild(div);
  saveToLocalStorage(movie, category);
  updateWatchTimeChart();
}

function showDetails(item) {
  const modal = document.getElementById('modal');
  const modalDetails = document.getElementById('modal-details');
  const closeBtn = document.getElementsByClassName('close')[0];

  fetch(`${BASE_URL}/${item.type}/${item.id}?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      if (item.type === 'movie') {
        modalDetails.innerHTML = `
          <h2>${data.title}</h2>
          <p>Ano de Lançamento: ${data.release_date.split('-')[0]}</p>
          <p>Duração: ${data.runtime} minutos</p>
          <p>Streaming: <a href="https://www.themoviedb.org/movie/${data.id}" target="_blank">Link</a></p>
        `;
      } else {
        modalDetails.innerHTML = `
          <h2>${data.name}</h2>
          <p>Ano de Lançamento: ${data.first_air_date.split('-')[0]}</p>
          <p>Status: ${data.status === 'Ended' ? 'Terminado' : 'Em Andamento'}</p>
          <p>Streaming: <a href="https://www.themoviedb.org/tv/${data.id}" target="_blank">Link</a></p>
          <p>Temporadas: ${data.number_of_seasons}</p>
          <div id="seasons"></div>
        `;
        displaySeasons(data.id, data.number_of_seasons);
      }
      modal.style.display = 'block';
    })
    .catch(error => console.error('Error:', error));

  closeBtn.onclick = function() {
    modal.style.display = 'none';
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }
}

function displaySeasons(tvId, numberOfSeasons) {
  const seasonsDiv = document.getElementById('seasons');
  seasonsDiv.innerHTML = '';
  const seasonPromises = [];
  for (let i = 1; i <= numberOfSeasons; i++) {
    seasonPromises.push(
      fetch(`${BASE_URL}/tv/${tvId}/season/${i}?api_key=${API_KEY}`)
        .then(response => response.json())
    );
  }
  Promise.all(seasonPromises)
    .then(seasons => {
      seasons.sort((a, b) => a.season_number - b.season_number);
      seasons.forEach(season => {
        const seasonDiv = document.createElement('div');
        seasonDiv.innerHTML = `
          <h3>Temporada ${season.season_number}</h3>
          <button onclick="markSeasonAsWatched(${tvId}, ${season.season_number})">Marcar Temporada como Assistida</button>
        `;
        season.episodes.forEach(episode => {
          const isChecked = localStorage.getItem(`episode-${episode.id}`) === 'true';
          const episodeDiv = document.createElement('div');
          episodeDiv.innerHTML = `
            <input type="checkbox" id="episode-${episode.id}" name="episode-${episode.id}" ${isChecked ? 'checked' : ''} onchange="saveEpisodeWatched(${episode.id})">
            <label for="episode-${episode.id}" onclick="showEpisodeDetails(${tvId}, ${season.season_number}, ${episode.id}, event)">${episode.name}</label>
          `;
          seasonDiv.appendChild(episodeDiv);
        });
        seasonsDiv.appendChild(seasonDiv);
      });
      updateSeriesProgressChart(tvId, seasons);
    })
    .catch(error => console.error('Error:', error));
}

function showEpisodeDetails(tvId, seasonNumber, episodeId, event) {
  fetch(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}/episode/${episodeId}?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(episode => {
      if (episode.name && episode.overview) {
        const episodeDetails = document.getElementById('episode-details');
        episodeDetails.innerHTML = `
          <h4>${episode.name}</h4>
          <p>${episode.overview}</p>
        `;
        episodeDetails.style.display = 'block';
        episodeDetails.style.top = `${event.clientY}px`;
        episodeDetails.style.left = `${event.clientX}px`;
      }
    })
    .catch(error => console.error('Error:', error));
}

function hideEpisodeDetails() {
  const episodeDetails = document.getElementById('episode-details');
  episodeDetails.style.display = 'none';
}

function saveEpisodeWatched(episodeId) {
  const isChecked = document.getElementById(`episode-${episodeId}`).checked;
  localStorage.setItem(`episode-${episodeId}`, isChecked);
  updateSeriesProgressChart();
}

function markSeasonAsWatched(tvId, seasonNumber) {
  fetch(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(season => {
      season.episodes.forEach(episode => {
        document.getElementById(`episode-${episode.id}`).checked = true;
        localStorage.setItem(`episode-${episode.id}`, true);
      });
      updateSeriesProgressChart(tvId, [season]);
    })
    .catch(error => console.error('Error:', error));
}

function updateSeriesProgressChart(tvId, seasons) {
  const totalEpisodes = seasons.reduce((acc, season) => acc + season.episodes.length, 0);
  const watchedEpisodes = seasons.reduce((acc, season) => {
    return acc + season.episodes.filter(episode => localStorage.getItem(`episode-${episode.id}`) === 'true').length;
  }, 0);

  const ctx = document.getElementById('seriesProgressChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Assistidos', 'Não Assistidos'],
      datasets: [{
        data: [watchedEpisodes, totalEpisodes - watchedEpisodes],
        backgroundColor: ['#e50914', '#333']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Progresso da Série'
        }
      }
    }
  });
}

function updateWatchTimeChart() {
  const moviesWatched = document.querySelectorAll('#filmes-assistidos .movies-grid div').length;
  const seriesWatched = document.querySelectorAll('#series-em-andamento .movies-grid div').length;

  const ctx = document.getElementById('watchTimeChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Filmes', 'Séries'],
      datasets: [{
        label: 'Horas Assistidas',
        data: [moviesWatched * 2, seriesWatched * 10], // Estimativa de 2 horas por filme e 10 horas por série
        backgroundColor: ['#e50914', '#333']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Horas Assistidas'
        }
      }
    }
  });
}

function saveToLocalStorage(movie, category) {
  const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
  savedMovies.push({ movie, category });
  localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
}

function loadFromLocalStorage() {
  const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
  savedMovies.forEach(({ movie, category }) => {
    let categoryDiv;
    switch (category) {
      case '1':
        categoryDiv = document.querySelector('#filmes-assistidos .movies-grid');
        break;
      case '2':
        categoryDiv = document.querySelector('#filmes-para-assistir .movies-grid');
        break;
      case '3':
        categoryDiv = document.querySelector('#series-em-andamento .movies-grid');
        break;
      case '4':
        categoryDiv = document.querySelector('#series-assistidas .movies-grid');
        break;
      default:
        return;
    }
    const div = document.createElement('div');
    div.innerHTML = `<img src="${movie.img}" alt="${movie.title}"><p>${movie.title}</p>`;
    div.addEventListener('click', () => showDetails(movie));
    categoryDiv.appendChild(div);
  });
  updateWatchTimeChart();
}

function clearResults() {
  const resultsGrid = document.getElementById('results-grid');
  const searchResultsSection = document.getElementById('search-results');
  resultsGrid.innerHTML = '';
  searchResultsSection.classList.add('hidden');
  updateWatchTimeChart();
}

window.onload = loadFromLocalStorage;
