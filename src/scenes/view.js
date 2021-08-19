import WizardScene from "telegraf/scenes/wizard";
import BigNumber from "bignumber.js";
import { fromDoc, numToStr } from "../utils";
import { getListByName, getRows } from "../google_doc";

const scene = new WizardScene(
  "view",
  (ctx) => {
    ctx.scene.state.id = 0;
    ctx.reply("Укажите номер записи");
    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.message) {
      ctx.scene.state.id = Number(ctx.message.text);
    }
    if (ctx.scene.state.id <= 0) {
      ctx.reply("Запись не найдена");
      return ctx.scene.leave();
    }
    getListByName(ctx.message.from.username)
      .then((list) => {
        if (list === false) {
          return false;
        }
        return getRows(list, {
          offset: Number(ctx.scene.state.id),
          limit: 1,
        });
      })
      .then((rows) => {
        if (rows.length === 1) {
          const add = new BigNumber(fromDoc(rows[0]["Приход"]));
          const sub = new BigNumber(fromDoc(rows[0]["Расход"]));
          const msg =
            rows[0]["когда"] +
            " " +
            (add > 0 ? "приход " + numToStr(add) : "расход " + numToStr(sub)) +
            " " +
            rows[0]["Тип"] +
            " | " +
            rows[0]["Статья"] +
            "\n" +
            rows[0]["Комментарий"];
          ctx.reply(msg);
          if (rows[0]["Файл"]) {
            setTimeout(() => {
              const files = rows[0]["Файл"].split("|");
              files.forEach((element) => {
                if (element.length <= 32) {
                  ctx.replyWithDocument(element);
                } else {
                  ctx.replyWithPhoto(element);
                }
              });
            }, 1000);
          }
        } else {
          ctx.reply("Запись не найдена");
        }
        return ctx.scene.leave();
      });
  }
);
scene.action("NEXT+1", (ctx) => {
  return ctx.wizard.steps[ctx.wizard.cursor + 1](ctx);
});
scene.action("cancel", (ctx) => {
  ctx.reply("Canceled");
  return ctx.scene.leave();
});
scene.command("cancel", (ctx) => {
  ctx.reply("Canceled");
  return ctx.scene.leave();
});

export default scene;
