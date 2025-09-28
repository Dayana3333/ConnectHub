// events/logHandler.js
const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const fs = require('fs');

function getLogSettings(guildId) {
  try {
    const data = fs.readFileSync("./logSettings.json", "utf8");
    const settings = JSON.parse(data);
    return settings[guildId] || null;
  } catch (err) {
    return null;
  }
}
module.exports.execute = (client) => {
  console.log("Loaded events/logHandler.js");
  // Üzenet létrehozás logolása
  client.on("messageCreate", async (message) => {
    try {
      if (message.author.bot || !message.guild) return;

      const logSettings = getLogSettings(message.guild.id);
      const logChannel = message.guild.channels.cache.get(logSettings?.normalLog);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setTitle("📨 Új üzenet")
        .addFields(
          { name: "Felhasználó", value: message.author.tag, inline: true },
          { name: "Csatorna", value: `${message.channel}`, inline: true },
          { name: "Üzenet", value: message.content || "[Üres üzenet]", inline: false }
        )
        .setColor("#00bfff")
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (err) {
      console.error("LogHandler messageCreate hiba:", err);
    }
  });

  // Üzenet törlés logolása
  client.on("messageDelete", async (message) => {
    try {
      if (message.partial || !message.guild) return;

      const logSettings = getLogSettings(message.guild.id);
      const logChannel = message.guild.channels.cache.get(logSettings?.normalLog);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setTitle("🗑️ Üzenet törölve")
        .addFields(
          { name: "Felhasználó", value: message.author?.tag || "Ismeretlen", inline: true },
          { name: "Csatorna", value: `${message.channel}`, inline: true },
          { name: "Üzenet", value: message.content || "[Üres üzenet]", inline: false }
        )
        .setColor("#ff5555")
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (err) {
      console.error("LogHandler messageDelete hiba:", err);
    }
  });


  client.on("messageUpdate", async (oldMsg, newMsg) => {
    try {
      if (oldMsg.partial || newMsg.partial || !oldMsg.guild) return;
      if (oldMsg.content === newMsg.content) return;

      const logSettings = getLogSettings(oldMsg.guild.id);
      const logChannel = oldMsg.guild.channels.cache.get(logSettings?.normalLog);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setTitle("✏️ Üzenet szerkesztve")
        .addFields(
          { name: "Felhasználó", value: oldMsg.author?.tag || "Ismeretlen", inline: true },
          { name: "Csatorna", value: `${oldMsg.channel}`, inline: true },
          { name: "Előző", value: oldMsg.content || "[Üres]", inline: false },
          { name: "Új", value: newMsg.content || "[Üres]", inline: false }
        )
        .setColor("#ffaa00")
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (err) {
      console.error("LogHandler messageUpdate hiba:", err);
    }
  });

  client.on("guildMemberUpdate", async (oldMember, newMember) => {
    try {
      // roles changed?
      const oldRoles = oldMember.roles.cache.map(r => r.id);
      const newRoles = newMember.roles.cache.map(r => r.id);
      const added = newRoles.filter(r => !oldRoles.includes(r));
      const removed = oldRoles.filter(r => !newRoles.includes(r));
      if (added.length === 0 && removed.length === 0) return;

      const logSettings = getLogSettings(newMember.guild.id);
      const logChannel = newMember.guild.channels.cache.get(logSettings?.normalLog);
      if (!logChannel) return;

      const fetchedLogs = await newMember.guild.fetchAuditLogs({
        limit: 5,
        type: AuditLogEvent.MemberRoleUpdate,
      });

      const auditEntry = fetchedLogs.entries.find(
        (entry) => entry.target.id === newMember.id && Date.now() - entry.createdTimestamp < 5000
      );
      const executor = auditEntry?.executor;

      const embed = new EmbedBuilder()
        .setTitle("🎭 Rangváltozás")
        .setColor(added.length > 0 ? "#00ff00" : "#ff0000")
        .setTimestamp()
        .setDescription(
          `👤 **Felhasználó:** <@${newMember.id}> (${newMember.user.tag})\n🛠️ **Műveletet végrehajtó:** ${executor ? `<@${executor.id}> (${executor.tag})` : "Ismeretlen"}`
        );

      if (added.length > 0) {
        embed.addFields({
          name: "✅ Hozzáadott rang(ok):",
          value: added.map(r => `<@&${r}>`).join(", "),
          inline: true,
        });
      }
      if (removed.length > 0) {
        embed.addFields({
          name: "❌ Eltávolított rang(ok):",
          value: removed.map(r => `<@&${r}>`).join(", "),
          inline: true,
        });
      }

      await logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error("❌ Rangváltozás logolási hiba:", error);
    }
  });

};