import Scene from "telegraf/scenes/base";
import { getLists, getRows } from "../google_doc";
import BigNumber from "decimal.js-light";
import { fromDoc } from "../utils";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/ru";

dayjs.extend(customParseFormat);
dayjs.locale("ru");

const scene = new Scene("report");
scene.enter(async (ctx) => {
  const now = dayjs().subtract(1, "month");
  const nowMonth = now.month();

  const lists = await getLists();
  const incoming = {};
  const expense = {};
  for (const list of lists) {
    const rows = (await getRows(list)).filter((row) => {
      const date = dayjs(row["Когда"], "DD.MM.YYYY");
      return nowMonth === date.month();
    });

    for (const row of rows) {
      const add = new BigNumber(fromDoc(row["Приход"]));
      const sub = new BigNumber(fromDoc(row["Расход"]));
      if (!incoming[row["Тип"]]) {
        incoming[row["Тип"]] = new BigNumber(0);
        expense[row["Тип"]] = new BigNumber(0);
      }
      if (add.eq(0)) {
        expense[row["Тип"]] = expense[row["Тип"]].plus(sub);
      } else {
        incoming[row["Тип"]] = incoming[row["Тип"]].plus(add);
      }
    }
  }

  const incomingMsg = [];
  for (const currency in incoming) {
    incomingMsg.push(incoming[currency].toString() + " " + currency);
  }
  const expenseMsg = [];
  for (const currency in expense) {
    expenseMsg.push(expense[currency].toString() + " " + currency);
  }

  const msg = `${now.format("MMMM YYYY")}:

Поступления:
${incomingMsg.join("\n") || "-"}

Расходы:
${expenseMsg.join("\n") || "-"}
`;

  ctx.reply(msg);

  return ctx.scene.leave();
});

export default scene;
