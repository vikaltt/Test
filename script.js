document.getElementById('student-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const group = document.getElementById('group').value;

  if (name && group) {
    // Сохранение данных в локальное хранилище
    localStorage.setItem('studentName', name);
    localStorage.setItem('studentGroup', group);

    // Проверка на возможность использования Telegram WebApp (если потребуется в дальнейшем)
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
    }

    // Переход на страницу выбора темы (можно заменить на ссылку в вашем проекте на GitHub)
    window.location.href = 'https://Ваш_проект.github.io/выбор_темы'; // Замените на нужный URL страницы
  }
});
