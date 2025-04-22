// Обработка главного меню
const startButton = document.getElementById('startButton');
const welcomeScreen = document.querySelector('.welcome-screen');
const mainContent = document.querySelector('.main-content');

startButton.addEventListener('click', () => {
    welcomeScreen.style.opacity = '0';
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
    }, 500);
});

// Ваш существующий код поиска
const searchButton = document.getElementById('searchButton');
// ... остальной код ...
