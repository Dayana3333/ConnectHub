// setupMutedRole.js
module.exports = {
  name: 'setupmutedrole',
  description: 'Létrehozza a Muted szerepet minden csatornán',
  async execute(message, args, client) {
    // Check bot permissions
    if (!message.guild.members.me.permissions.has('Administrator')) {
      return message.reply(
        '❌ Nincs elég jogosultságom! Adj nekem Administrator szerepet, hogy létrehozhassam a Muted role-t.'
      );
    }

    let mutedRole = message.guild.roles.cache.find(r => r.name === "Muted");

    if (!mutedRole) {
      try {
        console.log(`[INFO] Nincs "Muted" role a ${message.guild.name} szerveren. Létrehozás...`);

        mutedRole = await message.guild.roles.create({
          name: "Muted",
          color: "#555555",
          reason: "Spam védelemhez szükséges",
          permissions: [] // <-- NO PERMISSIONS
        });

        // Filter channels that can have permission overwrites
        const editableChannels = message.guild.channels.cache.filter(
          ch => ch.isTextBased() || ch.isVoiceBased()
        );

        for (const channel of editableChannels.values()) {
          try {
            await channel.permissionOverwrites.edit(mutedRole, {
              SendMessages: false,
              AddReactions: false,
              Speak: false,
              Connect: false
            });
            console.log(`[INFO] Permissions set for channel: ${channel.name}`);
          } catch (err) {
            console.error(`[ERROR] Cannot set permissions for channel ${channel.name}:`, err);
          }
        }

        console.log(`[INFO] Muted role létrehozva és beállítva a ${message.guild.name} szerveren.`);
        return message.reply(`✅ A Muted role sikeresen létrehozva a ${message.guild.name} szerveren!`);
      } catch (err) {
        console.error(`[ERROR] Nem tudtam létrehozni a Muted rangot:`, err);
        return message.reply(`❌ Hiba történt a Muted role létrehozásakor: ${err.message}`);
      }
    } else {
      console.log(`[INFO] Már létezik Muted role a ${message.guild.name} szerveren.`);
      return message.reply(`⚠️ Már létezik Muted role a szerveren.`);
    }
  }
};
