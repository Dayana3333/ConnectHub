const logSettings = require('../logSettings.json');

module.exports = (bot) => {
  bot.on('messageUpdate', async (oldMessage, newMessage) => {
    if (!newMessage.guild) return;

    // partial üzenetek betöltése
    if (oldMessage.partial) {
      try { await oldMessage.fetch(); } catch {}
    }
    if (newMessage.partial) {
      try { await newMessage.fetch(); } catch {}
    }

    if (newMessage.author?.bot) return;

    const logChannelId = logSettings[newMessage.guild.id];
    if (!logChannelId) return;

    const logChannel = newMessage.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    // ha nem változott a tartalom, ne logoljuk
    if (oldMessage.content === newMessage.content) return;

    logChannel.send(
      `✏️ **${newMessage.author.tag}** szerkesztette az üzenetét a <#${newMessage.channel.id}> csatornában.\n` +
      `**Régi üzenet: >** ${oldMessage.content || '*nincs szöveg*'}\n` +
      `**Új üzenete: >** ${newMessage.content || '*nincs szöveg*'}`
    );
  });
};
