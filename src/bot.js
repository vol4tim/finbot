import Telegraf from 'telegraf';
import SocksAgent from 'socks5-https-client/lib/Agent';
import { TOKEN_BOT, SOCKS_PROXY } from './config';

const bot = new Telegraf(TOKEN_BOT, {
  telegram: {
    agent: new SocksAgent(SOCKS_PROXY)
  }
});

export default bot;
