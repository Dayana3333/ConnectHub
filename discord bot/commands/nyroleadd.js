const createLiveJSON = require("../utils/liveJSON");
const giveawayRoles = createLiveJSON(__dirname + "/../giveawayRoles.json");

module.exports = {
  name: "nyroleadd",
  async execute(message, args) {
    const role = message.mentions.roles.first();
    if (!role) return message.reply("❌ Adj meg egy rangot!");

    const guildRoles = giveawayRoles.get(message.guild.id) || [];
    if (guildRoles.includes(role.id))
      return message.reply("⚠️ Ez a rang már hozzá van adva.");

    guildRoles.push(role.id);
    giveawayRoles.set(message.guild.id, guildRoles);

    return message.reply(`✅ Hozzáadva a nyereményjáték admin rangokhoz: ${role}`);
  },
};
