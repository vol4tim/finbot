import _ from "lodash";
import BigNumber from "bignumber.js";
import { fromDoc, numToStr } from "./utils";
import a, { getListByName, getRows } from "./google_doc";

(function () {
  a().then(() => {
    getListByName("vourhey")
      .then((list) => {
        if (list === false) {
          return false;
        }
        return getRows(list);
      })
      .then((rows) => {
        const list = {};
        rows.forEach((row) => {
          const add = new BigNumber(fromDoc(row["приход"]));
          const sub = new BigNumber(fromDoc(row["расход"]));
          if (!_.has(list, row["тип"])) {
            list[row["тип"]] = new BigNumber(0);
          }
          if (add > 0) {
            list[row["тип"]] = list[row["тип"]].plus(add);
          } else {
            list[row["тип"]] = list[row["тип"]].minus(sub);
          }
        });
        const msg = ["Ваш баланс:"];
        _.forEach(list, (balance, currency) => {
          msg.push(numToStr(balance) + " " + currency);
        });
        console.log(msg.join("\n"));
      });
  });
})();
