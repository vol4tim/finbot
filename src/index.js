import Telegraf from 'telegraf';
import session from 'telegraf/session';
import _ from 'lodash';
import bot from './bot';
import scenes from './scenes';
import User from './models/user';
import { createList, getListByName } from './google_doc';
import sync from './sync';

const runApp = () => {
  bot.use(session());
  bot.use(scenes);

  bot.command('add', ctx => ctx.scene.enter('add'));
  bot.command('sub', ctx => ctx.scene.enter('sub'));
  bot.command('remove', ctx => ctx.scene.enter('remove'));
  bot.command('balance', ctx => ctx.scene.enter('balance'));
  bot.command('view', ctx => ctx.scene.enter('view'));
  bot.command('history', ctx => ctx.scene.enter('history'));

  bot.hears('Приход', ctx => ctx.scene.enter('add'));
  bot.hears('Расход', ctx => ctx.scene.enter('sub'));

  const GLOBAL_KEYBOARD = Telegraf.Markup.keyboard([['Приход', 'Расход']])
    .resize()
    .extra();

  bot.start(ctx => {
    User.findOne({ where: { userId: ctx.from.id } }).then(user => {
      if (user === null) {
        User.create({ userId: ctx.from.id, username: ctx.from.username });
      }
    });
    getListByName(ctx.from.username).then(list => {
      if (_.isEmpty(list)) {
        return createList(ctx.from.username);
      }
      return false;
    });
    return ctx.reply('Welcome!', GLOBAL_KEYBOARD);
  });
  bot.startPolling();
};

sync().then(() => runApp());
