const createLiveJSON = require("../utils/liveJSON");
const giveawayRoles = createLiveJSON(__dirname + "/../giveawayRoles.json");

module.exports = {
  name: "nyroledel",
  async execute(message, args) {
    const role = message.mentions.roles.first();
    if (!role) return message.reply("❌ Adj meg egy rangot!");

    const guildRoles = giveawayRoles.get(message.guild.id) || [];
    const updated = guildRoles.filter((r) => r !== role.id);
    giveawayRoles.set(message.guild.id, updated);

    return message.reply(
      `🗑️ Eltávolítva a nyereményjáték admin rangok közül: ${role}`
    );
  },
};
