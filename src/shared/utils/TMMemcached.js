const Memcached = require('memcached');

export default class TMMemcached {
  constructor() {
    this.storage = {};
    this.connected = false;
    this.config = JSON.parse(process.env.TM_CACHE_CONFIG);
  }

  init() {
    // eslint-disable-next-line
    return new Promise(async (resolve, reject) => {
      const uri = process.env.TM_CACHE_SERVER || '127.0.0.1:11211';
      console.log('memcache uri: ', uri);
      try {
        this.memcached = await new Memcached(uri, {
          timeout: this.config.timeout,
          maxValue: 5242880,
        });
        // eslint-disable-next-line
        this.memcached.stats(( error )=>{
          if (error) return reject(error);
          this.connected = true;
          console.log('memcache connected');
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  get(key) {
    // eslint-disable-next-line
    return new Promise((resolve, reject) => {

      if (!this.connected) {
        if (this.storage[key] === undefined) reject(null); // eslint-disable-line
        const now = Math.floor(new Date() / 1000);
        if (parseInt(this.storage[key].ttl, 10) < now) reject(null); // eslint-disable-line
        resolve(this.storage[key].value);
      }

      this.memcached.get(key, (error, data) => {
        if (error || data === undefined) {
          reject(error);
        }
        resolve(data);
      });
    });
  }

  set(key, value, ttl) {
    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        const now = Math.floor(new Date() / 1000);
        try {
          this.storage[key] = {
            key,
            value,
            ttl: (parseInt(ttl, 10) + now),
          };
          console.log('saved to memory');
        } catch (error) {
          console.log('Can not save data to memory: ', error);
          reject(error);
        }
        return resolve();
      }
      try {
        this.memcached.set(key, value, parseInt(ttl, 10), (error) => {
          if (error) {
            console.log('Can not save data to memcache state: ', error);
            return reject(error);
          }
          console.log('saved to memcache');
          return resolve();
        });
      } catch (error) {
        console.log('Can not save data to memcache: ', error.message);
        reject(error);
      }
    });
  }

  shutdown() {
    this.memcached.end();
  }
}
