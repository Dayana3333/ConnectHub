const fs = require("fs");
const path = require("path");

const roleFile = path.join(__dirname, "../giveawayRoles.json");
let giveawayRoles = {};
if (fs.existsSync(roleFile)) {
  try {
    giveawayRoles = JSON.parse(fs.readFileSync(roleFile, "utf8"));
  } catch (err) {
    console.error("Hiba a giveawayRoles betöltésénél:", err);
  }
}
function saveRoles() {
  fs.writeFileSync(roleFile, JSON.stringify(giveawayRoles, null, 2));
}

module.exports = {
  name: "nyroleadd",
  async execute(message, args) {
    const role = message.mentions.roles.first();
    if (!role) return message.reply("❌ Adj meg egy rangot!");
    if (!giveawayRoles[message.guild.id]) giveawayRoles[message.guild.id] = [];
    if (giveawayRoles[message.guild.id].includes(role.id))
      return message.reply("⚠️ Ez a rang már hozzá van adva.");
    giveawayRoles[message.guild.id].push(role.id);
    saveRoles();
    return message.reply(`✅ Hozzáadva a nyereményjáték admin rangokhoz: ${role}`);
  },
};