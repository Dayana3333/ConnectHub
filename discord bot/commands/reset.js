// commands/reset.js
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { punishments } = require('../mybot_project/utils/spamData.js');

module.exports = {
  name: 'reset',
  description: 'Nullázza egy felhasználó warnjait (.reset @user)',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ Nincs jogosultságod ehhez a parancshoz!');
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply('Adj meg egy felhasználót pingelve! Pl.: `.reset @Felhasználó`');

    punishments.delete(member.id);

    const embed = new EmbedBuilder()
      .setTitle('♻️ Figyelmeztetések nullázva')
      .setColor('Green')
      .addFields(
        { name: 'Felhasználó', value: `${member}`, inline: true },
        { name: 'Moderátor', value: `${message.author}`, inline: true },
        { name: 'Státusz', value: 'Minden figyelmeztetés törölve ✅', inline: false }
      )
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};
