import Telegraf from 'telegraf';
import WizardScene from 'telegraf/scenes/wizard';
import _ from 'lodash';
import { financeAdd } from '../utils';

const scene = new WizardScene(
  'add',
  ctx => {
    ctx.scene.state.sum = 0;
    ctx.scene.state.category = '';
    ctx.scene.state.comment = '';
    ctx.scene.state.files = [];
    ctx.scene.state.status = false;
    ctx.reply('Укажите сумму прихода');
    return ctx.wizard.next();
  },
  ctx => {
    if (ctx.message) {
      const result = ctx.message.text.split(' ');
      ctx.scene.state.sum = Number(result[0].replace(',', '.'));
      ctx.scene.state.currency =
        result.length > 1 ? result[1].toUpperCase() : 'RUB';
    }
    ctx.reply(
      'Укажите категорию',
      Telegraf.Markup.inlineKeyboard([
        Telegraf.Markup.callbackButton('Пропустить', 'NEXT')
      ]).extra()
    );
    return ctx.wizard.next();
  },
  ctx => {
    if (ctx.message) {
      ctx.scene.state.category = ctx.message.text;
    }
    ctx.reply(
      'Укажите комментарий',
      Telegraf.Markup.inlineKeyboard([
        Telegraf.Markup.callbackButton('Пропустить', 'NEXT')
      ]).extra()
    );
    return ctx.wizard.next();
  },
  ctx => {
    if (ctx.message) {
      ctx.scene.state.comment = ctx.message.text;
    }
    ctx.reply(
      'Приложите фото чека',
      Telegraf.Markup.inlineKeyboard([
        Telegraf.Markup.callbackButton('Пропустить', 'NEXT')
      ]).extra()
    );
    return ctx.wizard.next();
  },
  ctx => {
    if (ctx.callbackQuery) {
      const { sum, currency, category, comment } = ctx.scene.state;
      financeAdd(
        ctx.callbackQuery.from.id,
        ctx.callbackQuery.from.username,
        1,
        sum,
        currency,
        category,
        comment,
        fileId
      );
      ctx.reply('Done');
      return ctx.scene.leave();
    }

    let fileId = null;
    if (ctx.message) {
      ctx.scene.state.userId = ctx.message.from.id;
      ctx.scene.state.username = ctx.message.from.username;
      if (_.has(ctx.message, 'photo')) {
        fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      } else if (_.has(ctx.message, 'document')) {
        fileId = ctx.message.document.file_id;
      }
    } else {
      console.log('error not found message');
    }
    ctx.scene.state.files.push(fileId);
    if (ctx.scene.state.status === false) {
      ctx.reply(
        'Приложите еще фото чека или завершите операцию',
        Telegraf.Markup.inlineKeyboard([
          Telegraf.Markup.callbackButton('Завершить', 'ADD')
        ]).extra()
      );
      ctx.scene.state.status = true;
      setTimeout(() => {
        ctx.scene.state.status = false;
      }, 1000);
    }
  }
);
scene.action('NEXT', ctx => {
  return ctx.wizard.steps[ctx.wizard.cursor](ctx);
});
scene.action('cancel', ctx => {
  ctx.reply('Canceled');
  return ctx.scene.leave();
});
scene.command('cancel', ctx => {
  ctx.reply('Canceled');
  return ctx.scene.leave();
});
scene.action('ADD', ctx => {
  const {
    userId,
    username,
    sum,
    currency,
    category,
    comment,
    files
  } = ctx.scene.state;
  financeAdd(
    userId,
    username,
    1,
    sum,
    currency,
    category,
    comment,
    files.join('|')
  );
  ctx.reply('Done');
  return ctx.scene.leave();
});
scene.command('ADD', ctx => {
  const {
    userId,
    username,
    sum,
    currency,
    category,
    comment,
    files
  } = ctx.scene.state;
  financeAdd(
    userId,
    username,
    1,
    sum,
    currency,
    category,
    comment,
    files.join('|')
  );
  ctx.reply('Done');
  return ctx.scene.leave();
});

export default scene;
