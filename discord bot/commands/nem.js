const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'nem',
  description: 'Válassz nemet gombbal!',
  async execute(message) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ferfi')
        .setLabel('🧔‍♂️ férfi')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('no')
        .setLabel('👱‍♀️ nő')
        .setStyle(ButtonStyle.Primary),
    );

    await message.channel.send({
      content: 'Mi a nemed? Válassz a gombok közül:',
      components: [row]
    });
  }
};
