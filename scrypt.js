document.getElementById('searchButton').addEventListener('click', async function() {
    const query = document.getElementById('animeInput').value.trim();
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        resultsDiv.innerHTML = '<p class="error">Введите название аниме</p>';
        return;
    }
    
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        resultsDiv.innerHTML = '';
        
        if (data.data.length === 0) {
            resultsDiv.innerHTML = '<p class="error">Ничего не найдено</p>';
            return;
        }
        
        data.data.slice(0, 5).forEach(anime => {
            const card = document.createElement('div');
            card.className = 'anime-card';
            card.innerHTML = `
                <h3>${anime.title}</h3>
                ${anime.images?.jpg?.image_url ? 
                  `<img src="${anime.images.jpg.image_url}" alt="${anime.title}">` : 
                  ''}
                <p>★ ${anime.score || 'Рейтинг отсутствует'}</p>
            `;
            resultsDiv.appendChild(card);
        });
    } catch (error) {
        resultsDiv.innerHTML = '<p class="error">Ошибка загрузки. Попробуйте позже</p>';
    }
});
