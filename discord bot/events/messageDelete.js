const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

const logSettingsPath = path.join(__dirname, '..', 'logSettings.json');

module.exports = (bot) => {
  bot.on('messageDelete', async (message) => {
    if (!message.guild) return;

    if (message.partial) {
      try { await message.fetch(); } catch { return; }
    }

    if (message.author?.bot) return;
    // read log settings live
    let settings = {};
    try {
      if (fs.existsSync(logSettingsPath)) {
        const raw = fs.readFileSync(logSettingsPath, 'utf8');
        settings = JSON.parse(raw) || {};
      }
    } catch (err) {
      console.error('Hiba a logSettings.json olvasásakor (messageDelete):', err);
      settings = {};
    }
    const guildConfig = settings[message.guild.id];
    if (!guildConfig) return;
    let logChannelId = null;
    if (typeof guildConfig === 'string') {
      logChannelId = guildConfig;
    } else if (typeof guildConfig === 'object' && guildConfig !== null) {
      // prefer normalLog
      logChannelId = guildConfig.normalLog || guildConfig.log || null;
    }
    if (!logChannelId) return;
    const logChannel = message.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const channelMention = message.channel ? `<#${message.channel.id}>` : 'Ismeretlen csatorna';
    const authorTag = message.author?.tag || 'Ismeretlen';
    const content = message.content || '*nincs szöveg (csatolmány vagy embed)*';

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('🗑️ Üzenet törölve')
      .addFields(
        { name: 'Felhasználó', value: `${authorTag}`, inline: true },
        { name: 'Csatorna', value: channelMention, inline: true },
        { name: 'Üzenet', value: content }
      )
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch((err) => {
      console.error('Nem sikerült elküldeni a törlés logot:', err);
    });
  });
};
