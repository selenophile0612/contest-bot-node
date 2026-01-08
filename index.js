const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

// Oddiy vaqtinchalik "baza"
const users = {}; 
// users[userId] = { id, name, points, referredBy }

bot.onText(/\/start(?:\s+(\d+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const name = msg.from.first_name;

  // Agar allaqachon ro‘yxatda bo‘lsa
  if (users[userId]) {
    bot.sendMessage(chatId, `👋 ${name}, siz allaqachon ishtirokchisiz.\n🏆 Ball: ${users[userId].points}`);
    return;
  }

  // Yangi foydalanuvchi
  let referredBy = null;

  if (match[1] && match[1] !== userId.toString()) {
    referredBy = match[1];
  }

  users[userId] = {
    id: userId,
    name,
    points: 0,
    referredBy
  };

  // Referal ball berish
  if (referredBy && users[referredBy]) {
    users[referredBy].points += 1;
    bot.sendMessage(
      referredBy,
      `🎉 Siz yangi ishtirokchini taklif qildingiz!\n+1 ball\n🏆 Jami: ${users[referredBy].points}`
    );
  }

  bot.sendMessage(
    chatId,
    `🎉 Xush kelibsiz, ${name}!\n\n🔗 Sizning referal havolangiz:\nhttps://t.me/${msg.bot.username}?start=${userId}\n\n🏆 Ball: 0`
  );
});

bot.on('message', (msg) => {
  if (!msg.text.startsWith('/')) {
    bot.sendMessage(msg.chat.id, "📌 Konkursda qatnashish uchun /start bosing");
  }
});
