import moment from "moment";
import BigNumber from "bignumber.js";
import { getListByName, addRow, delRow } from "./google_doc";
import Finance from "./models/finance";

export const numToStr = (num) => {
  return BigNumber(num).toString(10);
};

export const toDoc = (num) => {
  return num.replace(".", ",");
};

export const fromDoc = (num) => {
  const numEsc = num
    .replace(new RegExp("[^0-9,.-]", "g"), "")
    .replace(",", ".");
  if (numEsc) {
    return numEsc;
  }
  return 0;
};

export const financeAdd = (
  userId,
  username,
  type,
  sum,
  currency,
  category,
  comment,
  file
) => {
  let finRow;
  return Finance.create({
    userId,
    type,
    sum,
    currency,
    category,
    comment,
    file,
  })
    .then((res) => {
      finRow = res;
      return getListByName(username);
    })
    .then((list) => {
      if (list === false) {
        return false;
      }
      return addRow(list, {
        Когда: moment(new Date()).format("DD.MM.YYYY"),
        Тип: currency.toUpperCase(),
        Приход: type === 1 ? toDoc(numToStr(sum)) : "",
        Расход: type === 0 ? toDoc(numToStr(sum)) : "",
        Статья: category,
        Комментарий: comment,
        Файл: file,
        dbid: finRow.id,
      });
    });
};

export const financeDel = (userId, username, id) => {
  return getListByName(username).then((list) => {
    if (list === false) {
      return false;
    }
    return delRow(list, id);
  });
};
