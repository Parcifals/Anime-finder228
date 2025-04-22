document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const animeInput = document.getElementById('animeInput');
    const resultsDiv = document.getElementById('results');

    // Обработчик кнопки поиска
    searchButton.addEventListener('click', searchAnime);

    // Обработчик нажатия Enter в поле ввода
    animeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchAnime();
        }
    });

    async function searchAnime() {
        const query = animeInput.value.trim();
        
        if (!query) {
            showError('Введите название аниме');
            return;
        }

        try {
            searchButton.disabled = true;
            searchButton.textContent = 'Идет поиск...';
            
            const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error('Ошибка сервера');
            }
            
            const data = await response.json();
            showResults(data.data);
            
        } catch (error) {
            showError('Ошибка загрузки: ' + error.message);
        } finally {
            searchButton.disabled = false;
            searchButton.textContent = 'Поиск';
        }
    }

    function showResults(animeList) {
        resultsDiv.innerHTML = '';
        
        if (animeList.length === 0) {
            showError('Ничего не найдено');
            return;
        }

        animeList.slice(0, 10).forEach(anime => {
            const card = document.createElement('div');
            card.className = 'anime-card';
            card.innerHTML = `
                <h3>${anime.title}</h3>
                <img src="${anime.images?.jpg?.image_url || ''}" alt="${anime.title}" onerror="this.style.display='none'">
                <p>★ ${anime.score || 'Нет рейтинга'}</p>
                <p>Эпизоды: ${anime.episodes || '?'}</p>
            `;
            resultsDiv.appendChild(card);
        });
    }

    function showError(message) {
        resultsDiv.innerHTML = `<p class="error">${message}</p>`;
    }
});
