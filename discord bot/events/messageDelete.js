const { EmbedBuilder } = require('discord.js');
const logSettings = require('../logSettings.json');

module.exports = (bot) => {
  bot.on('messageDelete', async (message) => {
    if (!message.guild) return;

    if (message.partial) {
      try { await message.fetch(); } catch { return; }
    }

    if (message.author?.bot) return;

    const logChannelId = logSettings[message.guild.id];
    if (!logChannelId) return;

    const logChannel = message.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('🗑️ Üzenet törölve')
      .addFields(
        { name: 'Felhasználó', value: `${message.author.tag}`, inline: true },
        { name: 'Csatorna', value: `<#${message.channel.id}>`, inline: true },
        { name: 'Üzenet', value: message.content || '*nincs szöveg (csatolmány vagy embed)*' },
      )
      .setTimestamp();

    logChannel.send({ embeds: [embed] });
  });
};
