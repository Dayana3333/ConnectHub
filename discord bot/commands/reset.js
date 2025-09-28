// commands/reset.js
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { punishments } = require('../mybot_project/utils/spamData.js');

const LOG_CHANNEL_ID = '1421151297284997210'; // 1416515207009927339 ConnectHub némítások channelID

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

    // Timeout törlése
    try {
      await member.timeout(null);
    } catch (err) {
      await message.channel.send(`❌ Nem sikerült timeoutot törölni: ${err.message}`);
    }

    const embed = new EmbedBuilder()
      .setTitle('♻️ Figyelmeztetések nullázva')
      .setColor('Green')
      .addFields(
        { name: 'Felhasználó', value: `${member}`, inline: true },
        { name: 'Moderátor', value: `${message.author}`, inline: true },
        { name: 'Státusz', value: 'Minden figyelmeztetés törölve ✅', inline: false }
      )
      .setTimestamp();
      message.reply("✅ Warnok sikeresen nullázva!");

    // ==== CSATORNÁBA LOGOLÁS ====
    try {
      const logChannel = await message.guild.channels.fetch(LOG_CHANNEL_ID);
      if (!logChannel) {
        console.log(`Log csatorna nem találahtó: ${LOG_CHANNEL_ID}`);
      } else {
        await logChannel.send({ embeds: [embed] });
      }
    } catch (err) {
      console.error(`Nem sikerült logolni reset/warn: ${err.message}`);
    }
    return;
  },
};