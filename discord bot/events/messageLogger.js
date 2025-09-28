
const fs = require('fs');
const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports = (bot) => {
  bot.on('messageCreate', async (message) => {
    if (!message.guild || message.author.bot) return;

    // config olvasás
    if (!fs.existsSync('./logconfig.json')) return;
    const config = JSON.parse(fs.readFileSync('./logconfig.json'));
    const logChannelId = config[message.guild.id];
    if (!logChannelId) return;

    const logChannel = message.guild.channels.cache.get(logChannelId);
    if (!logChannel || logChannel.type !== ChannelType.GuildText) return;

    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(`📩 **Új üzenet:**\n${message.content || '*[nincs szöveg]*'}`)
      .addFields(
        { name: 'Felhasználó', value: `<@${message.author.id}>`, inline: true },
        { name: 'Csatorna', value: `<#${message.channel.id}>`, inline: true }
      )
      .setFooter({ text: `Felhasználó ID: ${message.author.id}` })
      .setTimestamp();

    try {
      await logChannel.send({ embeds: [embed] });
    } catch (err) {
      console.error('Nem sikerült logolni az üzenetet:', err);
    }
  });
};
