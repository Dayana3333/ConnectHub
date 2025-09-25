const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: "start",
  description: "Bot állapot információ",
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("❌ Ehhez a parancshoz admin jogosultság kell!");
    }

    const uptime = Math.floor(process.uptime());
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;

    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('✅ Bot Már Fut')
      .setDescription('A bot már aktívan fut. Használd a `.restart` parancsot az újraindításhoz.')
      .addFields(
        { name: '🕒 Futási idő', value: `${hours} óra ${minutes} perc ${seconds} másodperc`, inline: true },
        { name: '📡 Ping', value: `${client.ws.ping}ms`, inline: true },
        { name: '👥 Szerverek', value: `${client.guilds.cache.size}`, inline: true }
      )
      .setFooter({ text: `Lekérve: ${message.author.tag}` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};