import fs from 'node:fs';
import { parse } from 'csv-parse';
import {randomUUID} from 'node:crypto'
import {Database} from './database.js'

const __dirname = new URL('../', import.meta.url).pathname;
const database = new Database()

const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(`${__dirname}/dataCSV.csv`)
    .pipe(parse({
      delimiter: ',',
      from_line: 2,
    }))
    ;
  for await (const record of parser) {
    records.push(record);
  }
  return records;
};

(async () => {
  const records = await processFile();
  records.forEach(row =>{
    const task = {
      id:randomUUID(),
      title:row[0],
      description:row[1],
      completed_at: null,
      created_at: new Date(new Date()-3600*1000*3).toISOString(),
      updated_at: new Date(new Date()-3600*1000*3).toISOString(),
    }
    database.insert('tasks', task)
  })
})();

