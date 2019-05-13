import Scene from 'telegraf/scenes/base';
import _ from 'lodash';
import { fromDoc, numToStr } from '../utils';
import { getListByName, getRows } from '../google_doc';

const scene = new Scene('history');
scene.enter(ctx => {
  getListByName(ctx.from.username)
    .then(list => {
      if (list === false) {
        return false;
      }
      return getRows(list);
    })
    .then(rows => {
      const groups = {};
      _.forEach(rows, (row, i) => {
        if (!_.has(groups, row['статья'])) {
          groups[row['статья']] = {
            list: []
          };
        }
        groups[row['статья']].list.push({ ...row, ID: i });
      });
      _.forEach(groups, (group, groupName) => {
        let message = '';
        message += 'Категория: ' + groupName + '\n----------------\n';
        _.forEach(group.list, row => {
          if (message.length > 3900) {
            message += '\n';
            ctx.reply(message);
            message = '';
          }
          const add = Number(fromDoc(row['приход']));
          const sub = Number(fromDoc(row['расход']));
          message +=
            '# ' +
            (Number(row.ID) + 1) +
            ' | Тип: ' +
            (add > 0 ? 'приход' : 'расход') +
            ' | Сумма: ' +
            (add > 0 ? numToStr(add) : numToStr(sub)) +
            ' ' +
            row['тип'] +
            ' | Дата: ' +
            row['когда'] +
            ' | Ком: ' +
            row['комментарий'] +
            '\n';
        });
        message += '\n';
        ctx.reply(message);
      });
    });
  return ctx.scene.leave();
});

export default scene;
