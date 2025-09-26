const fs = require('fs');

module.exports = (bot) => {
  bot.on('guildMemberAdd', async member => {
    // betöltjük a logSettings.json-t
    let logSettings = {};
    if (fs.existsSync('./logSettings.json')) {
      logSettings = JSON.parse(fs.readFileSync('./logSettings.json', 'utf8'));
    }

    // Az üzenet, amit a bot küldeni fog DM-ben
    const dmMessage = `👋 Üdv a szerveren ${member.user.username}, érezd jól magad!`;

    // DM küldés az új tagnak
    try {
      await member.send(dmMessage);
    } catch (err) {
      console.error(`Nem sikerült DM-et küldeni ${member.user.tag}-nak:`, err);
    }

    // Log csatorna
    const logChannelId = logSettings[member.guild.id];
    if (logChannelId) {
      const logChannel = member.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        // jelzés a log csatornába
        logChannel.send(
          `📩 **ConnectHub bot üzenetet küldött** ${member.user.tag}-nak.\n` +
          `📜 **Üzenet tartalma:** ${dmMessage}`
        );
      }
    }
  });
};
