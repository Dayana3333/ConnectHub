// utils/liveJSON.js
const fs = require("fs");

function createLiveJSON(filePath) {
  return {
    get(key) {
      try {
        const data = fs.readFileSync(filePath, "utf8");
        const json = JSON.parse(data || "{}");
        return key ? json[key] : json;
      } catch {
        return key ? undefined : {};
      }
    },
    set(key, value) {
      const data = this.get();
      data[key] = value;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    },
    delete(key) {
      const data = this.get();
      delete data[key];
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    },
  };
}

module.exports = createLiveJSON;
