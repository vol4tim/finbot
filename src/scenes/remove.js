import Telegraf from 'telegraf';
import WizardScene from 'telegraf/scenes/wizard';
import BigNumber from 'bignumber.js';
import { financeDel, fromDoc, numToStr } from '../utils';
import { getListByName, getRows } from '../google_doc';

const scene = new WizardScene(
  'remove',
  ctx => {
    ctx.scene.state.id = 0;
    ctx.reply('Укажите номер удаляемой записи');
    return ctx.wizard.next();
  },
  ctx => {
    if (ctx.message) {
      ctx.scene.state.id = Number(ctx.message.text);
    }
    if (ctx.scene.state.id <= 0) {
      ctx.reply('Запись не найдена');
      return ctx.scene.leave();
    }
    return getListByName(ctx.message.from.username)
      .then(list => {
        if (list === false) {
          return false;
        }
        return getRows(list, {
          offset: ctx.scene.state.id,
          limit: 1
        });
      })
      .then(rows => {
        if (rows.length === 1) {
          const add = new BigNumber(fromDoc(rows[0]['приход']));
          const sub = new BigNumber(fromDoc(rows[0]['расход']));
          const msg =
            'Вы действительно хотите удалить запись?\n' +
            rows[0]['когда'] +
            ' ' +
            (add > 0 ? 'приход ' + numToStr(add) : 'расход ' + numToStr(sub)) +
            ' ' +
            rows[0]['тип'] +
            ' | ' +
            rows[0]['статья'] +
            '\n' +
            rows[0]['комментарий'];
          ctx.reply(
            msg,
            Telegraf.Markup.inlineKeyboard([
              Telegraf.Markup.callbackButton('Подтвердить', 'NEXT+1'),
              Telegraf.Markup.callbackButton('Отмена', 'cancel')
            ]).extra()
          );
        } else {
          ctx.reply('Запись не найдена');
          return ctx.scene.leave();
        }
      });
  },
  ctx => {
    let userId;
    let username;
    if (ctx.message) {
      userId = ctx.message.from.id;
      username = ctx.message.from.username;
    } else if (ctx.callbackQuery) {
      userId = ctx.callbackQuery.from.id;
      username = ctx.callbackQuery.from.username;
    } else {
      ctx.reply('error');
      return ctx.scene.leave();
    }
    financeDel(userId, username, ctx.scene.state.id).then(result => {
      if (result === false) {
        ctx.reply('Запись не найдена');
      } else {
        ctx.reply('Запись удалена');
      }
    });
    return ctx.scene.leave();
  }
);
scene.action('NEXT+1', ctx => {
  return ctx.wizard.steps[ctx.wizard.cursor + 1](ctx);
});
scene.action('cancel', ctx => {
  ctx.reply('Canceled');
  return ctx.scene.leave();
});
scene.command('cancel', ctx => {
  ctx.reply('Canceled');
  return ctx.scene.leave();
});

export default scene;
