// setupMutedRole.js
module.exports = {
  name: 'setupMutedRole',
  description: 'Létrehozza a Muted szerepet minden csatornán',
  async execute(message, args, client) {
    // Check if bot has Administrator
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
          reason: "Spam védelemhez szükséges"
        });

        // Set permissions for all channels
        for (const [channelId, channel] of message.guild.channels.cache) {
          await channel.permissionOverwrites.edit(mutedRole, {
            SendMessages: false,
            AddReactions: false,
            Speak: false,
            Connect: false
          }).catch(err => console.error(`[ERROR] Nem sikerült beállítani a jogosultságokat:`, err));
        }

        console.log(`[INFO] Muted role létrehozva és beállítva a ${message.guild.name} szerveren.`);
        message.reply(`✅ A Muted role sikeresen létrehozva a ${message.guild.name} szerveren!`);
      } catch (err) {
        console.error(`[ERROR] Nem tudtam létrehozni a Muted rangot:`, err);
        message.reply(`❌ Hiba történt a Muted role létrehozásakor: ${err.message}`);
      }
    } else {
      console.log(`[INFO] Már létezik Muted role a ${message.guild.name} szerveren.`);
      message.reply(`⚠️ Már létezik Muted role a szerveren.`);
    }
  }
};