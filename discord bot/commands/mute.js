const ms = require('ms'); // npm install ms
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');

// betöltjük a logSettings-et (azért kívülre tesszük, hogy minden futásnál legyen friss)
let logSettings = {};
if (fs.existsSync('./logSettings.json')) {
  logSettings = JSON.parse(fs.readFileSync('./logSettings.json', 'utf8'));
}

module.exports = {
  name: 'mute',
  description: 'Ideiglenesen némít egy felhasználót',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return message.reply('❌ Nincs jogosultságod!');

    const member = message.mentions.members.first();
    if (!member) return message.reply('❌ Jelölj ki egy felhasználót!');

    const mutedRole = message.guild.roles.cache.find(r => r.name === 'Muted');
    if (!mutedRole) return message.reply('❌ Nincs "Muted" rang a szerveren!');

    const duration = args[1];
    if (!duration) return message.reply('❌ Add meg az időtartamot! pl.: 5m, 1h');

    const time = ms(duration);
    if (!time) return message.reply('❌ Érvénytelen időformátum! pl.: 5m, 1h');

    const reason = args.slice(2).join(' ') || 'Nincs megadva';

    // némítás
    await member.roles.add(mutedRole, `Tempmute: ${reason}`);

    // Embed a logoláshoz
    const muteEmbed = new EmbedBuilder()
      .setTitle('🔇 Felhasználó némítva')
      .setColor('DarkRed')
      .addFields(
        { name: 'Felhasználó', value: `${member}`, inline: true },
        { name: 'Időtartam', value: duration, inline: true },
        { name: 'Indok', value: reason, inline: false },
        { name: 'Némította', value: `${message.author}`, inline: true }
      )
      .setTimestamp();

    // === LOGOLÁS a muteLog csatornába ===
    const guildLogs = logSettings[message.guild.id];
    if (guildLogs && guildLogs.muteLog) {
      const logChannel = message.guild.channels.cache.get(guildLogs.muteLog);
      if (logChannel) {
        logChannel.send({
          embeds: [muteEmbed.setFooter({ text: 'Mute log' })]
        }).catch(console.error);
      }
    }

    // Timeout a lejárt némítás feloldására
    setTimeout(async () => {
      if (member.roles.cache.has(mutedRole.id)) {
        await member.roles.remove(mutedRole, 'Tempmute lejárt');
      }
    }, time);
  }
};
