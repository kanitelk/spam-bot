import * as dotenv from 'dotenv';

dotenv.config();

export default {
  BOT_TOKEN: process.env.BOT_TOKEN,
  SOCKS_HOST: process.env.SOCKS_HOST,
  SOCKS_PORT: process.env.SOCKS_PORT,
  SOCKS_USERNAME: process.env.SOCKS_USERNAME,
  SOCKS_PASSWORD: process.env.SOCKS_PASSWORD
}