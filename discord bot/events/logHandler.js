client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return; // bot üzeneteket kihagyjuk

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

  logChannel.send({ embeds: [embed] });
});
// Üzenet törlés logolása
client.on("messageDelete", async (message) => {
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

  logChannel.send({ embeds: [embed] });
});


client.on("messageUpdate", async (oldMsg, newMsg) => {
  if (oldMsg.partial || newMsg.partial || !oldMsg.guild) return;
  if (oldMsg.content === newMsg.content) return;
  const logSettings = getLogSettings(oldMsg.guild.id);
  const logChannel = oldMsg.guild.channels.cache.get(logSettings?.normalLog);
  if (!logChannel) return;

  const embed = new EmbedBuilder()
    .setTitle("✏️ Üzenet szerkesztve")
    .addFields(
      { name: "Felhasználó", value: oldMsg.author?.tag, inline: true },
      { name: "Csatorna", value: `${oldMsg.channel}`, inline: true },
      { name: "Előző", value: oldMsg.content || "[Üres]", inline: false },
      { name: "Új", value: newMsg.content || "[Üres]", inline: false }
    )
    .setColor("#ffaa00")
    .setTimestamp();

  logChannel.send({ embeds: [embed] });
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  try {
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

    logChannel.send({ embeds: [embed] });
  } catch (error) {
    console.error("❌ Rangváltozás logolási hiba:", error);
  }
});