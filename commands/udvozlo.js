// commands/welcome.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'dmudvozlo',
  description: 'Üdvözlő embedet küld a szerver logójával DM-ben',
  async execute(message) {
    // ne reagáljon botokra
    if (message.author.bot) return;

    try {
      // embed felépítése
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`Üdvözlünk a(z) ${message.guild.name} szerveren! 🎉`)
        .setDescription(`Kérlek olvasd el a szabályokat, és érezd jól magad!`)
        // szerver ikon (logó) thumbnailként
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
        // footer például a szerver nevével
        .setFooter({ text: `Szerver: ${message.guild.name}` })
        .setTimestamp();

      // DM küldése a felhasználónak
      await message.author.send({ embeds: [embed] });
      
    } catch (error) {
      console.error('Hiba történt az üzenet küldése során:', error);
      
      // Ha a felhasználó nem fogad el DM-eket
      if (error.code === 50007) {
        await message.reply('Nem tudtam üzenetet küldeni neked, mert nem fogadsz privát üzeneteket! 🔒');
      } else {
        await message.reply('Hiba történt az üzenet küldése során. 😢');
      }
    }
  },
};