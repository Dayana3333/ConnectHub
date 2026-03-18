const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Segítség a parancsokhoz.',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor('#042632')
      .setTitle('👋 Üdvözöllek a parancsok között!')
      .setDescription(
        `✏️ **.nick <felhasználóID> <új név / clear>** - Becenév módosítása vagy törlése.\n` +
        `ℹ️ **.help** - Kiírja az elérhető parancsokat.\n` +
        `📖 **.szab** - Szerver szabályzat kíirása. \n` +
        `😀 **.emojilist** - Megjeleníti a jelenlegi emojikat a szerveren. \n\n` +
        `+ *A botban található egy **spam gátló rendszer** is*.` +
        `+ *AntiRaid*` 
      )
      .setFooter({ text: `Parancsot kérte: ${message.author.tag}` })
     .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  }
};
