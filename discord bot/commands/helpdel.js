const fs = require("fs");
const file = "./helpRoles.json";

module.exports = {
  name: "helpdel",
  description: "Eltávolít egy rangot az adminhelp használatából.",
  async execute(message, args) {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ Nincs jogosultságod ehhez!");
    }

    const role = message.mentions.roles.first();
    if (!role) return message.reply("❌ Adj meg egy rangot!");

    let data = {};
    if (fs.existsSync(file)) {
      data = JSON.parse(fs.readFileSync(file, "utf8"));
    }

    if (!data[message.guild.id]) data[message.guild.id] = [];
    data[message.guild.id] = data[message.guild.id].filter(r => r !== role.id);

    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    return message.reply(`🗑️ A(z) ${role} rang el lett távolítva a listából!`);
  }
};
