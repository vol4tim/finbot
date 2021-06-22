import Telegraf from "telegraf";
import SocksAgent from "socks5-https-client/lib/Agent";
import { TOKEN_BOT, SOCKS_PROXY } from "./config";

const options = {};
if (SOCKS_PROXY) {
  options.telegram = {
    agent: new SocksAgent(SOCKS_PROXY),
  };
}

const bot = new Telegraf(TOKEN_BOT, options);

export default bot;
