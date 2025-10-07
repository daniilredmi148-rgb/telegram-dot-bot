const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Токен будет установлен через переменные окружения Render
const token = process.env.BOT_TOKEN;

if (!token) {
  console.log('❌ Ошибка: BOT_TOKEN не установлен!');
  process.exit(1);
}

// Создаем бота
const bot = new TelegramBot(token, { polling: true });

console.log('🚀 Бот запускается на Render...');

// Функция для удаления сообщений с точкой
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const text = msg.text;
  
  // Проверяем, есть ли текст и содержит ли он точку
  if (text && text.includes('.')) {
    console.log(`🗑️ Удаляю сообщение от ${msg.from.first_name}: ${text}`);
    
    // Пытаемся удалить сообщение
    bot.deleteMessage(chatId, messageId).catch(error => {
      console.log('❌ Ошибка удаления:', error.message);
      
      // Если нет прав, отправляем сообщение
      if (error.response && error.response.body.error_code === 400) {
        bot.sendMessage(chatId, 
          `⚠️ Я не могу удалять сообщения! 
Пожалуйста, сделайте меня администратором и дайте право "Удалять сообщения"`);
      }
    });
  }
});

// Веб-сервер для Render
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Telegram Bot on Render</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          .status { color: green; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>🤖 Telegram Bot on Render</h1>
        <p>Бот удаляет сообщения с символом "." в группах Telegram</p>
        <p>🟢 <span class="status">Статус: Активен</span></p>
        <p>📍 Хостинг: Render.com</p>
        <p>⏰ Запущен: ${new Date().toLocaleString()}</p>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`🌐 Веб-сервер запущен на порту ${port}`);
});

// Обработка ошибок
bot.on('error', (error) => {
  console.log('❌ Ошибка бота:', error);
});

bot.on('polling_error', (error) => {
  console.log('❌ Ошибка polling:', error);
});

console.log('✅ Бот успешно запущен на Render!');
