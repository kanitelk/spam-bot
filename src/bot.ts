import TelegramBot, { Message } from "node-telegram-bot-api";
import config from "./config";
import { predict } from "./predict";
import { readTrainFromFile } from "./train";
const Agent = require("socks5-https-client/lib/Agent");

const logger = (msg: Message) => {
  console.log(
    `${msg.chat.username} (${msg.chat.first_name} ${msg.chat.last_name}): ${msg.text}`
  );
};

export const bot = new TelegramBot(config.BOT_TOKEN, {
  request: {
    agentClass: Agent,
    agentOptions: {
      // @ts-ignore
      socksHost: config.SOCKS_HOST,
      socksPort: config.SOCKS_PORT,
      socksUsername: config.SOCKS_USERNAME,
      socksPassword: config.SOCKS_PASSWORD,
    },
  },
});

bot.on("photo", (msg: Message) => {
  const chatId = msg.chat.id;
  const msgId: number = msg.message_id;
  bot.sendMessage(
    chatId,
    `${msg.chat.first_name}, I not work with images now 🛠`,
    { reply_to_message_id: msg.message_id }
  );
});

bot.onText(/\/start/, (msg: Message) => {
  const chatId = msg.chat.id;
  const msgId: number = msg.message_id;

  bot.sendMessage(
    chatId,
    `Hi, ${msg.chat.first_name}. Send me English text and i say you: this is spam or not`
  );
});

bot.on("text", (msg: Message) => {
  const chatId = msg.chat.id;
  const msgId: number = msg.message_id;

  let res = predict(readTrainFromFile(), msg.text);

  logger(msg);

  if (res.spam >= res.ham) {
    bot.sendMessage(
      chatId,
      `🤢 This is <b>SPAM</b> \n\n<pre>ham rate: ${res.ham} \nspam rate: ${res.spam}</pre>`,
      { parse_mode: "HTML", reply_to_message_id: msgId }
    );
  } else {
    bot.sendMessage(
      chatId,
      `🎉 This is <b>HAM</b> \n\n<pre>ham rate: ${res.ham} \nspam rate: ${res.spam}</pre>`,
      { parse_mode: "HTML", reply_to_message_id: msgId }
    );
  }
});
