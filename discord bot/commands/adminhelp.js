const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const file = "./helpRoles.json";

module.exports = {
  name: "adminhelp",
  description: "Admin parancsokhoz.",
  async execute(message) {
    // betöltjük a szerepköröket
    let data = {};
    if (fs.existsSync(file)) {
      data = JSON.parse(fs.readFileSync(file, "utf8"));
    }
    const allowedRoles = data[message.guild.id] || [];

    // ha nincs engedélyezett rang vagy a user nem rendelkezik velük
    if (!allowedRoles.some(r => message.member.roles.cache.has(r))) {
      return message.reply("❌ Nincs jogosultságod ehhez a parancshoz!");
    }

    const embed = new EmbedBuilder()
      .setColor("#042632")
      .setTitle("👋 Üdvözöllek a parancsok között!")
      .setDescription(
        `📩 **.embed** – Küld egy alapértelmezett beágyazott üzenetet.\n` +
        `💬 **.say <szöveg>** – Kiíratja a szöveget a bottal.\n` +
        `✏️ **.nick <id> <név/clear>** – Becenév módosítása.\n` +
        `🔨 **.ban <id> [indok]** – Kitiltás.\n` +
        `🚪 **.kick <id> [indok]** – Kidobás.\n` +
        `🧹 **.clear <szám>** – Üzenetek törlése.\n` +
        `📊 **.szavazas <kérdés>** – Igen/Nem szavazás.\n` +
        `⚡ **.gyszav <kérdés>** – Gyors szavazás.\n` +
        `♻️ **.unban <id>** – Kitiltás feloldása.\n` +
        `🔇 **.mute <felhasználó> <idő>** – Némítás.\n` +
        `🗣 **.unmute <felhasználó>** – Némítás feloldása.\n` +
        `📥 **.log set ...** – Log csatorna beállítása.\n` +
        `👥 **.backup** – Szerver mentés.\n` +
        `🌀 **.reakcio <emoji> <@rang>** – Reakció rang.\n\n` +
        `*+ AntiSpam & AntiRaid rendszer*`
      )
      .setFooter({ text: `Parancsot kérte: ${message.author.tag}` })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  }
};
