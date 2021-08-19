import { GoogleSpreadsheet } from "google-spreadsheet";
import Promise from "bluebird";
import { GOOGLE_DOC_ID } from "../config";
import creds from "./client_secret.json";

const doc = new GoogleSpreadsheet(GOOGLE_DOC_ID);

export default async function authGoogle() {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });
  return doc;
}

export async function createList(name) {
  return await doc.addSheet({
    title: name,
    headerValues: [
      "Когда",
      "Тип",
      "Приход",
      "Расход",
      "Статья",
      "Комментарий",
      "Файл",
      "dbid",
    ],
  });
}

export async function getListByName(name) {
  await doc.loadInfo();
  return doc.sheetsByTitle[name];
}

export const addRow = (list, data) => {
  return new Promise((resolve, reject) => {
    list.addRow(data, (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
};

export async function getRows(sheet, query = {}) {
  return await sheet.getRows(query);
}

export const delRow = (list, id) => {
  return getRows(list, {
    offset: id,
    limit: 1,
  }).then((rows) => {
    if (rows.length === 1) {
      rows[0].del();
      return true;
    }
    return false;
  });
};
