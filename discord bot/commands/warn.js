// commands/warn.js
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { punishments } = require('../mybot_project/utils/spamData.js');

const LOG_CHANNEL_ID = '1421151297284997210'; // 1416515207009927339 ConnectHub némítások channelID

module.exports = {
  name: 'warn',
  description: 'Warnol vagy nulláz warnokat (reset)',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ Nincs jogosultságod ehhez a parancshoz!');
    }

    if (!args.length) {
      return message.reply('Használat: `.warn @felhasználó` vagy `.reset @felhasználó`');
    }

    // ======= RESET =======
    if (args[0].toLowerCase() === 'reset') {
      const target = message.mentions.members.first();
      if (!target) return message.reply('Adj meg egy felhasználót pingelve! Pl.: `.reset @Felhasználó`');

      await message.channel.send(`✅ Reset command received for ${target}`);

      // Delete warnings
      punishments.delete(target.id);

      // Message in the same channel
      await message.channel.send(`✅ Reset command received for ${target}`);

      // Remove any active timeout
      try {
        await message.channel.send(`Trying to give timeout...`);
        await member.timeout(60 * 60 * 1000); // Passing null removes timeout
      } catch (err) {
        await message.channel.send(`❌ Nem sikerült timeoutot törölni: ${err.message}`);
      }

      const embed = new EmbedBuilder()
        .setTitle('♻️ Figyelmeztetések nullázva')
        .setColor('Green')
        .addFields(
          { name: 'Felhasználó', value: `${target}`, inline: true },
          { name: 'Moderátor', value: `${message.author}`, inline: true },
          { name: 'Státusz', value: `Minden figyelmeztetés törölve ✅`, inline: false } //\nReset száma: ${resetCount}
        )
        .setTimestamp();
    }
    // ======= WARN =======
    const member = message.mentions.members.first();
    if (!member) return message.reply('Adj meg egy felhasználót pingelve! Pl.: `.warn @Felhasználó`');

    let warns = punishments.get(member.id) || 0;
    warns++;
    punishments.set(member.id, warns);

    const embed = new EmbedBuilder()
      .setTitle('⚠️ Warn kiadva')
      .setColor('Yellow')
      .addFields(
        { name: 'Felhasználó', value: `${member}`, inline: true },
        { name: 'Moderátor', value: `${message.author}`, inline: true },
        { name: 'Warnok száma', value: `${warns}`, inline: true }
      )
      .setTimestamp();


    // ==== CSATORNÁBA LOGOLÁS ====
    try {
      const logChannel = await message.guild.channels.fetch(LOG_CHANNEL_ID);
      if (!logChannel) {
        console.log(`Log channel not found: ${LOG_CHANNEL_ID}`);
      } else {
        await logChannel.send({ embeds: [embed] });
      }
    } catch (err) {
      console.error(`Failed to log reset/warn: ${err.message}`);
    }

    // ======= SZANKCIÓK =======
    try {
      if (warns === 3) {
        await member.timeout(30 * 60 * 1000, '3 warn – 30 perc felfüggesztés');
        await member.send(`🔇 30 perces felfüggesztést kaptál a(z) ${message.guild.name} szerveren (3 figyelmeztetés).`);
        await message.channel.send(`${member} 30 percre felfüggesztve (timeout) 3 figyelmeztetés miatt.`);
      } else if (warns === 5) {
        await member.timeout(60 * 60 * 1000, '5 warn – 1 óra felfüggesztés');
        await member.send(`🔇 1 órás felfüggesztést kaptál a(z) ${message.guild.name} szerveren (5 figyelmeztetés).`);
        await message.channel.send(`${member} 1 órára felfüggesztve (timeout) 5 figyelmeztetés miatt.`);
      } else if (warns >= 6) {
        await member.timeout(7 * 24 * 60 * 60 * 1000, '6+ warn – hosszú felfüggesztés');
        await member.send(`🚫 Hosszú felfüggesztést kaptál a(z) ${message.guild.name} szerveren spamelés miatt.`);
        await message.channel.send(`${member} hosszú időre felfüggesztve (timeout) 6+ figyelmeztetés miatt.`);
      }
    } catch (err) {
      await message.reply(`❌ Nem sikerült timeoutolni a tagot: ${err.message}`);
    }
  },
};
