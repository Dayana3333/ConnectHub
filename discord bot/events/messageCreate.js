
const fs = require('fs');
const path = require('path');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

// csúnya szavak betöltése
const badWordsPath = path.join(__dirname, '..', 'badwords.json');
let badWords = [];
try {
  const bwRaw = fs.readFileSync(badWordsPath, 'utf8');
  badWords = JSON.parse(bwRaw).words || [];
} catch (err) {
  console.error('Hiba a badwords.json betöltésekor:', err);
}

// paths
const logSettingsPath = path.join(__dirname, '..', 'logSettings.json');

// itt add meg a moderátor szerep ID-ját
const MODERATOR_ROLE_ID = '1421156251294892072'; // <-- saját ID

module.exports = (bot) => {
  bot.on('messageCreate', async (message) => {
    if (!message.guild || message.author.bot) return;

    // --- Load log settings FRESH for every event (ensures live updates) ---
    let logSettings = {};
    try {
      if (fs.existsSync(logSettingsPath)) {
        const raw = fs.readFileSync(logSettingsPath, 'utf8');
        logSettings = JSON.parse(raw);
      }
    } catch (err) {
      console.error('Hiba a logSettings.json olvasásakor:', err);
      logSettings = {};
    }

    // mindenki akinek admin/managemessages/moderatemembers van
    // vagy rendelkezik a moderátor szereppel, mentesül
    const isExempt =
      message.member.permissions.any([
        PermissionsBitField.Flags.Administrator,
        PermissionsBitField.Flags.ManageMessages,
        PermissionsBitField.Flags.ModerateMembers
      ]) ||
      message.member.roles.cache.has(MODERATOR_ROLE_ID);

    const content = message.content.toLowerCase();

    // --- KÁROMKODÁS SZŰRÉS ---
    if (!isExempt && badWords.some(word => content.includes(word))) {
      await message.delete().catch(() => { });
      await message.channel.send(`${message.author}, ne használj tiltott szavakat! ⛔`).catch(() => { });
      return;
    }

    // --- CAPS SZŰRÉS ---
    if (!isExempt) {
      const letters = message.content.replace(/[^a-zA-ZÁÉÍÓÖŐÚÜŰáéíóöőúüű]/g, '');
      if (letters.length >= 8) {
        const caps = letters.replace(/[^A-ZÁÉÍÓÖŐÚÜŰ]/g, '');
        const ratio = caps.length / letters.length;
        if (ratio > 0.7) {
          await message.delete().catch(() => { });
          await message.channel.send(`${message.author}, ne írj végig nagybetűkkel! 🔇`).catch(() => { });
          return;
        }
      }
    }

    // --- NSFW LINK SZŰRÉS ---
    if (!isExempt) {
      const nsfwRegex = /(porn|xvideos|xnxx|sex|xxx)/i;
      if (nsfwRegex.test(content)) {
        await message.delete().catch(() => { });
        await message.channel.send(`${message.author}, ne ossz meg pornográf tartalmat! 🚫`).catch(() => { });
        return;
      }
    }

    // --- LINK SZŰRÉS ---
    if (!isExempt) {
      const linkRegex = /(https?:\/\/[^\s]+)/gi;
      if (linkRegex.test(message.content)) {
        await message.delete().catch(() => { });
        await message.channel.send(`${message.author}, linkek küldése nem engedélyezett számodra.! 🔗🚫`).catch(() => { });
        return;
      }
    }

    // --- LOGOLÁS ---
    const guildLogs = logSettings[message.guild.id];
    const logChannelId = guildLogs?.normalLog;

    if (logChannelId) {
      const logChannel = message.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        const embed = new EmbedBuilder()
          .setColor('Blue')
          .setTitle('📩 Új üzenet')
          .addFields(
            { name: 'Felhasználó', value: message.author.tag, inline: true },
            { name: 'Csatorna', value: `${message.channel}`, inline: true },
            { name: 'Üzenet', value: message.content && message.content.length ? message.content : '*nincs szöveg*' }
          )
          .setTimestamp();


        logChannel.send({ embeds: [embed] }).catch(() => { });
      }
    }
  });
};
