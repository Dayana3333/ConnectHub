
const fs = require('fs');
const path = require('path');

const logSettingsPath = path.join(__dirname, '..', 'logSettings.json');

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

    // live read

    let settings = {};
    try {
      if (fs.existsSync(logSettingsPath)) {
        const raw = fs.readFileSync(logSettingsPath, 'utf8');
        settings = JSON.parse(raw) || {};
      }
    } catch (err) {
      console.error('Hiba a logSettings.json olvasásakor (messageUpdate):', err);
      settings = {};
    }

    const guildConfig = settings[newMessage.guild.id];
    if (!guildConfig) return;

    let logChannelId = null;
    if (typeof guildConfig === 'string') {
      logChannelId = guildConfig;
    } else if (typeof guildConfig === 'object' && guildConfig !== null) {
      logChannelId = guildConfig.normalLog || guildConfig.log || null;
    }
    if (!logChannelId) return;

    const logChannel = newMessage.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    // ha nem változott a tartalom, ne logoljuk
    if (oldMessage.content === newMessage.content) return;

    // Embed
    const { EmbedBuilder } = require('discord.js');
    const embed = new EmbedBuilder()
      .setTitle('✏️ Üzenet szerkesztve')
      .setColor('#ffaa00')
      .addFields(
        { name: 'Felhasználó', value: newMessage.author?.tag || 'Ismeretlen', inline: true },
        { name: 'Csatorna', value: `<#${newMessage.channel.id}>`, inline: true },
        { name: 'Előző üzenet', value: oldMessage.content || '*nincs szöveg*', inline: false },
        { name: 'Új üzenet', value: newMessage.content || '*nincs szöveg*', inline: false }
      )
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch((err) => {
      console.error('Nem sikerült elküldeni a szerkesztett üzenet logot:', err);
    });
  });
};
