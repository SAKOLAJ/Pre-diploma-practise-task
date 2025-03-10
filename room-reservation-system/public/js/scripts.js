// Ожидаем загрузки контента страницы
document.addEventListener('DOMContentLoaded', function() {
  // Получаем элемент календаря по ID
  const calendarEl = document.getElementById('calendar');

  // Инициализация календаря FullCalendar
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth', // Начальный вид календаря (месяц)
    firstDay: 1, // Устанавливаем первый день недели на понедельник (1), 0 - воскресенье
    events: 'http://localhost:3000/api/reservations', // URL для получения событий (резерваций)
    
    // Функция для кастомизации отображения события на календаре
    eventContent: function(arg) {
      const title = arg.event.title; // Получаем название события
      const purpose = arg.event.extendedProps.purpose; // Получаем цель события
      const attendees = arg.event.extendedProps.attendees; // Получаем количество участников

      // Возвращаем HTML-контент для отображения в карточке события
      return {
        html: `
          <div style="font-size: 12px;">
            <strong>${title}</strong><br>
            <small>Purpose: ${purpose}</small><br>
            <small>Attendees: ${attendees}</small>
          </div>
        `
      };
    },

    // Функция для обработки клика по событию
    eventClick: function(info) {
      const title = info.event.title; // Название события
      const purpose = info.event.extendedProps.purpose; // Цель события
      const attendees = info.event.extendedProps.attendees; // Участники события

      // Показать информацию о событии в виде всплывающего окна (alert)
      alert(`
        Title: ${title}\n
        Purpose: ${purpose}\n
        Attendees: ${attendees}
      `);
    }
  });

  // Рендерим календарь
  calendar.render();
});

// Функция для отправки формы бронирования
function submitBookingForm(event) {
  // Отменяем стандартное поведение формы (перезагрузку страницы)
  event.preventDefault();

  // Собираем данные из формы в объект FormData
  const formData = new FormData(event.target);
  const data = {
    room_id: parseInt(formData.get('room')), // ID комнаты
    date: formData.get('date'), // Дата бронирования
    start_time: formData.get('startTime'), // Время начала
    end_time: formData.get('endTime'), // Время окончания
    purpose: formData.get('purpose'), // Цель бронирования
    attendees: parseInt(formData.get('attendees')) // Количество участников
  };

  // Отправляем POST-запрос на сервер с данными бронирования
  fetch('http://localhost:3000/api/reservations', {
    method: 'POST', // Метод запроса
    headers: {
      'Content-Type': 'application/json' // Тип содержимого JSON
    },
    body: JSON.stringify(data) // Преобразуем данные в JSON
  })
  .then(response => {
    if (!response.ok) { // Проверяем, успешен ли ответ
      return response.json().then(err => {
        throw new Error(err.message || 'Server error'); // В случае ошибки выбрасываем исключение
      });
    }
    return response.json(); // Если ответ успешен, преобразуем его в JSON
  })
  .then(data => {
    // При успешном добавлении бронирования показываем сообщение и перезагружаем страницу
    alert('Reservation added successfully!');
    window.location.reload(); // Перезагружаем страницу для обновления данных календаря
  })
  .catch(error => {
    // Обрабатываем ошибки, если что-то пошло не так
    console.error('Error:', error);
    alert('Error adding reservation: ' + error.message); // Показываем сообщение об ошибке
  });
}
