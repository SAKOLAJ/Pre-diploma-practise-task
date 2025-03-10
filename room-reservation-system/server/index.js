// Подключаем необходимые модули
const express = require('express'); // Express для создания веб-сервера
const moment = require('moment-timezone'); // Moment.js для работы с датами и временем с учетом часовых поясов
const mysql = require('mysql2'); // MySQL2 для работы с базой данных MySQL
const cors = require('cors'); // CORS для настройки политики доступа

// Инициализируем приложение Express
const app = express();
const port = 3000; // Устанавливаем порт для сервера

// Настройка подключения к базе данных MySQL
const db = mysql.createConnection({
  host: 'localhost', // Хост базы данных
  user: 'root', // Пользователь для подключения
  password: 'root', // Пароль пользователя
  database: 'room_reservation' // Имя базы данных
});

// Подключаемся к базе данных и выводим сообщение об успешном подключении
db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Настройка CORS для разрешения запросов с любого домена
app.use(cors({
  origin: '*', // Разрешаем запросы с любых источников
  methods: ['GET', 'POST'], // Разрешаем методы GET и POST
  allowedHeaders: ['Content-Type'] // Разрешаем только заголовок Content-Type
}));

// Настройка Express для обработки JSON данных
app.use(express.json());

// Маршрут для получения всех резерваций
app.get('/api/reservations', (req, res) => {
  // Запрос к базе данных для получения всех резерваций
  db.query('SELECT * FROM reservations', (err, results) => {
    if (err) {
      console.error('SQL Error:', err); // Логируем ошибку, если она произошла
      res.status(500).json({ success: false, message: 'Error fetching reservations', error: err.message });
      return;
    }

    // Преобразуем полученные данные в формат, подходящий для календаря
    const events = results.map(reservation => {
      // Преобразуем дату в строку формата YYYY-MM-DD с учетом часового пояса
      const date = moment(reservation.date).tz('Europe/Riga').format('YYYY-MM-DD');

      // Формируем объект события для календаря
      return {
        id: reservation.id,
        title: `Room: ${reservation.room_id}, Purpose: ${reservation.purpose}, Attendees: ${reservation.attendees}`,
        start: `${date}T${reservation.start_time}`, // Начало события
        end: `${date}T${reservation.end_time}`, // Конец события
        extendedProps: {
          purpose: reservation.purpose, // Цель бронирования
          attendees: reservation.attendees // Количество участников
        }
      };
    });

    // Логируем события перед отправкой их на фронтенд
    console.log('Sending events:', events);
    res.json(events); // Отправляем события на фронтенд
  });
});

// Маршрут для добавления новой резервации
app.post('/api/reservations', (req, res) => {
  // Извлекаем данные из тела запроса
  const { room_id, date, start_time, end_time, purpose, attendees } = req.body;

  // SQL-запрос для добавления новой резервации
  const sql = `INSERT INTO reservations (room_id, date, start_time, end_time, purpose, attendees) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [room_id, date, start_time, end_time, purpose, attendees]; // Значения для запроса

  // Выполняем запрос на добавление резервации в базу данных
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err); // Логируем ошибку, если она произошла
      res.status(500).json({ success: false, message: 'Error adding reservation' });
    } else {
      res.json({ success: true, message: 'Reservation added successfully' }); // Отправляем успешный ответ
    }
  });
});

// Запуск сервера на указанном порту
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`); // Логируем запуск сервера
});
