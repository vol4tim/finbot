import GoogleSpreadsheet from 'google-spreadsheet';
import Promise from 'bluebird';
import _ from 'lodash';
import { GOOGLE_DOC_ID } from '../config';
import creds from './client_secret.json';

const doc = new GoogleSpreadsheet(GOOGLE_DOC_ID);

export default () => {
  return new Promise((resolve, reject) => {
    doc.useServiceAccountAuth(creds, err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};

export const createList = name => {
  return new Promise((resolve, reject) => {
    doc.addWorksheet(
      {
        title: name,
        headers: [
          'Когда',
          'Тип',
          'Приход',
          'Расход',
          'Статья',
          'Комментарий',
          'Файл',
          'dbid'
        ]
      },
      err => {
        if (err) {
          reject(err);
        }
        resolve(true);
      }
    );
  });
};

export const getListByName = name => {
  return new Promise((resolve, reject) => {
    doc.getInfo((err, info) => {
      if (err) {
        reject(err);
      }
      const list = _.find(info.worksheets, { title: name });
      resolve(list);
    });
  });
};

export const addRow = (list, data) => {
  return new Promise((resolve, reject) => {
    list.addRow(data, (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
};

export const getRows = (list, query = {}) => {
  return new Promise((resolve, reject) => {
    list.getRows(query, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

export const delRow = (list, id) => {
  return getRows(list, {
    offset: id,
    limit: 1
  }).then(rows => {
    if (rows.length === 1) {
      rows[0].del();
      return true;
    }
    return false;
  });
};
