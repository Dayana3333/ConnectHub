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
        /*`**.start** Bot elinditása.\n` +
        `**.reload** Bot újrainditása.\n` +
        `**.stop** Bot leállitása. \n` +*/
        `+ *A botban található egy **spam gátló rendszer** is*.` +
        `+ *AntiRaid*` 
      )
      .setFooter({ text: `Parancsot kérte: ${message.author.tag}` })
      .setAuthor({
        name: 'Készítő: regedit_404', // A bot fejlesztője
        iconURL: 'https://media.discordapp.net/attachments/1410384904104972401/1412875523910012958/E8CAB3A7-8579-43C4-B02A-EDA91AC67894.png'
      })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  }
};
