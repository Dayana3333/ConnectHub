const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const os = require('os');

module.exports = {
  name: "status",
  description: "Megmutatja a bot állapotát",
  async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("❌ Ehhez a parancshoz admin jogosultság kell!");
    }
    const uptime = Math.floor(process.uptime());
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📊 Bot Státusz')
      .addFields(
        { name: '🕒 Uptime', value: `${hours}h ${minutes}m ${seconds}s`, inline: true },
        { name: '📡 Ping', value: `${client.ws.ping}ms`, inline: true },
        { name: '👥 Szerverek', value: `${client.guilds.cache.size}`, inline: true },
        { name: '👤 Felhasználók', value: `${client.users.cache.size}`, inline: true },
        { name: '💾 Memória', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`, inline: true },
        { name: '🖥️ CPU', value: `${os.cpus()[0].model}`, inline: false }
      )
      .setFooter({ text: `Bot: ${client.user.tag}` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};