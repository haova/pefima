import Dexie from 'dexie';
import IDBExportImport from 'indexeddb-export-import';

const extractControls = (doc, controlNames) => {
  const controls = {};
  const newDoc = {};

  for (let key in doc){
    if (controlNames.indexOf(key) !== -1){
      controls[key] = doc[key];
      continue;
    }

    newDoc[key] = doc[key];
  }

  return {
    controls, 
    doc: newDoc
  };
}

const DB = {
  async init(){
    this.db = new Dexie("PefimaDB");
    this.db.version(1).stores({
      transactions: '++id,detail,source,amount,tags,createdAt'
    });

    await this.db.open();
  },

  async clearDB(){
    const idbDatabase = this.db.backendDB();

    return await new Promise((resolve, reject) => {
      IDBExportImport.clearDatabase(idbDatabase, function(err) {
        if (err){
          reject(err);
          return;
        }

        resolve();
      })
    });
  },

  async deleteDB(){
    return await this.db.delete();
  },

  async importDB(jsonString){
    const idbDatabase = this.db.backendDB();

    await this.clearDB();

    return await new Promise((resolve, reject) => {
      IDBExportImport.importFromJsonString(idbDatabase, jsonString, function(err) {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  },

  async exportDB(){
    const idbDatabase = this.db.backendDB();

    return await new Promise((resolve, reject) => {
      IDBExportImport.exportToJsonString(idbDatabase, function(err, jsonString) {
        if (err) {
          reject(err);
        }
      
        resolve(jsonString);
      });
    });
  },

  async get(storeName, id){
    return await this.db[storeName].get(id);
  },

  async list(storeName, query = {}){
    const { doc, controls } = extractControls(query, ['$limit', '$skip', '$sort', '$search'])

    let queryBuilder = this.db[storeName];

    if (controls.$search && controls.$search.$text){
      queryBuilder = queryBuilder.where('title').startsWithIgnoreCase(controls.$search.$text);
    }

    if (Object.keys(doc).length > 0){
      queryBuilder = queryBuilder.filter(originDoc => {
        for (let key in doc)
          if (originDoc[key] !== doc[key])
            return false;

        return true;
      });
    }

    if (controls.$skip){
      queryBuilder = queryBuilder.offset(controls.$skip);
    }

    if (controls.$limit !== -1){
      queryBuilder = queryBuilder.limit(controls.$limit || 10);
    }

    if (controls.$sort){
      const key = Object.keys(controls.$sort)[0];

      if (controls.$sort[key] === -1){
        queryBuilder = queryBuilder.reverse();
      }

      return await queryBuilder.sortBy(key);
    } else {
      return await queryBuilder.toArray()
    }
  },

  async create(storeName, doc){
    return await this.db[storeName].add(doc);
  },

  async createMany(storeName, docs){
    return await this.db[storeName].bulkAdd(docs);
  },

  async update(storeName, id, doc){
    return await this.db[storeName].update(id, doc);
  },

  async remove(storeName, id){
    return await this.db[storeName].delete(id);
  },

  async removeWhere(storeName, query){
    return await this.db[storeName].where(query).delete();
  }
}

export default DB;