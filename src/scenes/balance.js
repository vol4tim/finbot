import Scene from "telegraf/scenes/base";
import _ from "lodash";
import BigNumber from "bignumber.js";
import { fromDoc, numToStr } from "../utils";
import { getListByName, getRows } from "../google_doc";

const scene = new Scene("balance");
scene.enter((ctx) => {
  getListByName(ctx.from.username)
    .then((list) => {
      if (list === false) {
        return false;
      }
      return getRows(list);
    })
    .then((rows) => {
      const list = {};
      rows.forEach((row) => {
        const add = new BigNumber(fromDoc(row["Приход"]));
        const sub = new BigNumber(fromDoc(row["Расход"]));
        if (!_.has(list, row["Тип"])) {
          list[row["Тип"]] = new BigNumber(0);
        }
        if (add.eq(0)) {
          list[row["Тип"]] = list[row["Тип"]].minus(sub);
        } else {
          list[row["Тип"]] = list[row["Тип"]].plus(add);
        }
      });
      const msg = ["Ваш баланс:"];
      _.forEach(list, (balance, currency) => {
        msg.push(numToStr(balance) + " " + currency);
      });
      ctx.reply(msg.join("\n"));
    });
  return ctx.scene.leave();
});

export default scene;
