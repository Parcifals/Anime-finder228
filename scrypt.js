document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const searchButton = document.getElementById('searchButton');
    const animeInput = document.getElementById('animeInput');
    const resultsDiv = document.getElementById('results');
    const errorDiv = document.getElementById('errorMessage');
    const typeFilter = document.getElementById('typeFilter');
    const buttonText = document.querySelector('.button-text');
    const spinner = document.querySelector('.loading-spinner');
    
    // Обработчики событий
    searchButton.addEventListener('click', searchAnime);
    animeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchAnime();
    });
    
    // Основная функция поиска
    async function searchAnime() {
        const query = animeInput.value.trim();
        const type = typeFilter.value;
        
        // Валидация
        if (!query) {
            showError('Пожалуйста, введите название аниме');
            return;
        }
        
        try {
            // Показываем состояние загрузки
            searchButton.disabled = true;
            buttonText.textContent = 'Поиск...';
            spinner.classList.remove('hidden');
            errorDiv.classList.add('hidden');
            
            // Формируем URL запроса
            let url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=12`;
            if (type) url += `&type=${type}`;
            
            // Выполняем запрос
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Обработка результатов
            if (data.data && data.data.length > 0) {
                displayResults(data.data);
            } else {
                showError('Ничего не найдено. Попробуйте другой запрос.');
            }
            
        } catch (error) {
            showError(`Ошибка при поиске: ${error.message}`);
            console.error('Search error:', error);
        } finally {
            // Восстанавливаем кнопку
            searchButton.disabled = false;
            buttonText.textContent = 'Поиск';
            spinner.classList.add('hidden');
        }
    }
    
    // Отображение результатов
    function displayResults(animeList) {
        resultsDiv.innerHTML = '';
        
        animeList.forEach(anime => {
            const card = document.createElement('div');
            card.className = 'anime-card';
            card.innerHTML = `
                <img src="${anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || ''}" 
                     alt="${anime.title}" 
                     onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
                <div class="anime-info">
                    <h3>${anime.title}</h3>
                    <p>★ ${anime.score || 'Нет рейтинга'}</p>
                    <p>Тип: ${getTypeName(anime.type)}</p>
                    <p>Эпизоды: ${anime.episodes || '?'}</p>
                </div>
            `;
            resultsDiv.appendChild(card);
        });
    }
    
    // Показ ошибок
    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        resultsDiv.innerHTML = '';
    }
    
    // Преобразование типа
    function getTypeName(type) {
        const types = {
            'tv': 'TV Сериал',
            'movie': 'Фильм',
            'ova': 'OVA',
            'special': 'Спешл',
            'ona': 'ONA'
        };
        return types[type] || type;
    }
});
