const fs = require('fs');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

// csúnya szavak betöltése
const badWords = JSON.parse(fs.readFileSync('./badwords.json')).words;

// logbeállítások betöltése
let logSettings = {};
if (fs.existsSync('./logSettings.json')) {
  logSettings = JSON.parse(fs.readFileSync('./logSettings.json', 'utf8'));
}

// itt add meg a moderátor szerep ID-ját
const MODERATOR_ROLE_ID = '1414177749429522524'; // <-- saját ID

module.exports = (bot) => {
  bot.on('messageCreate', async (message) => {
    if (!message.guild || message.author.bot) return;

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
      await message.delete().catch(() => {});
      await message.channel.send(`${message.author}, ne használj tiltott szavakat! ⛔`).catch(() => {});
      return;
    }

    // --- CAPS SZŰRÉS ---
    if (!isExempt) {
      const letters = message.content.replace(/[^a-zA-ZÁÉÍÓÖŐÚÜŰáéíóöőúüű]/g, '');
      if (letters.length >= 8) {
        const caps = letters.replace(/[^A-ZÁÉÍÓÖŐÚÜŰ]/g, '');
        const ratio = caps.length / letters.length;
        if (ratio > 0.7) {
          await message.delete().catch(() => {});
          await message.channel.send(`${message.author}, ne írj végig nagybetűkkel! 🔇`).catch(() => {});
          return;
        }
      }
    }

    // --- NSFW LINK SZŰRÉS ---
    if (!isExempt) {
      const nsfwRegex = /(porn|xvideos|xnxx|sex|xxx)/i;
      if (nsfwRegex.test(content)) {
        await message.delete().catch(() => {});
        await message.channel.send(`${message.author}, ne ossz meg pornográf tartalmat! 🚫`).catch(() => {});
        return;
      }
    }

    // --- LINK SZŰRÉS ---
    if (!isExempt) {
      const linkRegex = /(https?:\/\/[^\s]+)/gi;
      if (linkRegex.test(message.content)) {
        await message.delete().catch(() => {});
        await message.channel.send(`${message.author}, linkek küldése nem engedélyezett számodra.! 🔗🚫`).catch(() => {});
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


        logChannel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  });
};
