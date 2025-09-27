const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

const joinSettingsPath = path.join(__dirname, '..', 'joinSettings.json');

module.exports = (bot) => {
  bot.on('guildMemberAdd', async member => {
    if (!member.guild) return;

    // live read joinSettings
    let joinSettings = {};
    try {
      if (fs.existsSync(joinSettingsPath)) {
        const raw = fs.readFileSync(joinSettingsPath, 'utf8');
        joinSettings = JSON.parse(raw) || {};
      }
    } catch (err) {
      console.error('Hiba a joinSettings.json olvasásakor (guildMemberAdd):', err);
      joinSettings = {};
    }

    const logChannelId = joinSettings[String(member.guild.id)];
    if (!logChannelId) return;

    // fetch channel if not cached
    let logChannel = member.guild.channels.cache.get(logChannelId);
    if (!logChannel) {
      try {
        logChannel = await member.guild.channels.fetch(logChannelId);
      } catch (err) {
        console.error('Nem sikerült lekérni a log csatornát:', err);
        return;
      }
    }

    // --- EMBED LOG ---
    const embed = new EmbedBuilder()
      .setTitle('📥 Új tag érkezett')
      .setDescription(`👤 **Tag:** ${member.user.tag}\n🆔 **ID:** ${member.id}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Csatlakozás ideje', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
      )
      .setColor('#00bfff')
      .setTimestamp();

    try {
      await logChannel.send({ embeds: [embed] });
    } catch (err) {
      console.error('Nem sikerült elküldeni a join logot:', err);
    }

    // --- DM the new member ---
    const dmMessage = `👋 Üdv a szerveren ${member.user.username}, érezd jól magad!`;
    try {
      await member.send(dmMessage);
    } catch (err) {
      console.error(`Nem sikerült DM-et küldeni ${member.user.tag}-nak:`, err);
    }
  });
};