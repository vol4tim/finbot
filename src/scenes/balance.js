import Scene from 'telegraf/scenes/base';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import { fromDoc, numToStr } from '../utils';
import { getListByName, getRows } from '../google_doc';

const scene = new Scene('balance');
scene.enter(ctx => {
  getListByName(ctx.from.username)
    .then(list => {
      if (list === false) {
        return false;
      }
      return getRows(list);
    })
    .then(rows => {
      const list = {};
      rows.forEach(row => {
        const add = new BigNumber(fromDoc(row['приход']));
        const sub = new BigNumber(fromDoc(row['расход']));
        if (!_.has(list, row['тип'])) {
          list[row['тип']] = new BigNumber(0);
        }
        if (add > 0) {
          list[row['тип']] = list[row['тип']].plus(add);
        } else {
          list[row['тип']] = list[row['тип']].minus(sub);
        }
      });
      const msg = ['Ваш баланс:'];
      _.forEach(list, (balance, currency) => {
        msg.push(numToStr(balance) + ' ' + currency);
      });
      ctx.reply(msg.join('\n'));
    });
  return ctx.scene.leave();
});

export default scene;
