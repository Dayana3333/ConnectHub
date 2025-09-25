const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'author',
  description: 'A bot fejlesztőjének bemutatkozása.',
  async execute(message) {
    const username = message.author.username || 'Ismeretlen felhasználó';
    const avatar = message.author.displayAvatarURL({ dynamic: true }) || null;

    const embed = new EmbedBuilder()
      .setColor(rgb=("#042632"))
      .setAuthor({ name: username, iconURL: avatar })
      .setTitle('👋 Üdvözöllek!')
      .setDescription(`Helló! Én vagyok a bot készítője.\n\n💻 Szeretek botokat fejleszteni, kódolni, és új dolgokat tanulni.\n🛠️ A bot folyamatosan fejlesztés alatt áll, szóval bármi javaslatot szívesen fogadok!`)
      .setFooter({ text: 'Köszönöm, hogy használod a botot!' })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  }
};
