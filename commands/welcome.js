// commands/welcome.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'welcome',
  description: 'Sends a welcome embed with the server logo',
  async execute(message) {
    // ignore bot messages
    if (message.author.bot) return;

    // build embed
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`Welcome to ${message.guild.name}! 🎉`)
      .setDescription(`Please read the rules and have a great time!`)
      // server icon (logo) as thumbnail
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
      // footer, for example with the server name
      .setFooter({ text: `Server: ${message.guild.name}` })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};
