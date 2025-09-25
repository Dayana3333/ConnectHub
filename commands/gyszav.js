const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "gyszav",
  description: "Gyors igen/nem szavazás",
  async execute(message, args) {
    // Jogosultság ellenőrzése
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply("❌ Ehhez a parancshoz admin jogosultság kell!");
    }

    if (!args.length) {
      return message.reply("Adj meg egy kérdést! Pl.: !gyszav Szeretitek a pizzát?");
    }

    const question = args.join(" ");
    const embed = new EmbedBuilder()
      .setTitle("⚡ Gyors szavazás")
      .setDescription(`**${question}**`)
      .setColor("#042632")
      .setFooter({ text: `Szavazást indította: ${message.author.tag}` });

    const pollMessage = await message.channel.send({ embeds: [embed] });
    await pollMessage.react("✅"); // Igen
    await pollMessage.react("❌"); // Nem
    await pollMessage.react("🤷"); // Tartózkodom

    // Reaction collector
    const filter = (reaction, user) => !user.bot;
    const collector = pollMessage.createReactionCollector({ filter, time: 30000 }); // 30 mp

    collector.on("collect", (reaction, user) => {
      // összes többi reakció törlése a usertől, kivéve amit most nyomott
      pollMessage.reactions.cache.forEach(r => {
        if (r.emoji.name !== reaction.emoji.name) {
          r.users.remove(user.id).catch(() => {});
        }
      });
    });

    collector.on("end", () => {
      // Szavazatok összesítése
      const results = {
        "✅": pollMessage.reactions.cache.get("✅")?.count - 1 || 0, // -1 mert a bot is reagált
        "❌": pollMessage.reactions.cache.get("❌")?.count - 1 || 0,
        "🤷": pollMessage.reactions.cache.get("🤷")?.count - 1 || 0,
      };

      const resultEmbed = new EmbedBuilder()
        .setTitle("📊 Szavazás végeredménye")
        .setDescription(
          `✅ Igen: **${results["✅"]}**\n❌ Nem: **${results["❌"]}**\n🤷 Tartózkodom: **${results["🤷"]}**`
        )
        .setColor("Gold");

      message.channel.send({ embeds: [resultEmbed] });
    });
  },
};