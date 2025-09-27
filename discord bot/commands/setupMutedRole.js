// setupMutedRole.js
module.exports = {
  name: 'setupmutedrole',
  description: 'Létrehozza a Muted szerepet minden csatornán',
  async execute(message, args, client) {
    // Check bot permissions
    if (!message.guild.members.me.permissions.has('Administrator')) {
      return message.reply(`❌ I don't have Administrator role to create the Muted role!`);
    }

    let mutedRole = message.guild.roles.cache.find(r => r.name === "Muted");

    if (!mutedRole) {
      try {
        message.reply(`Muted role doesn't exist on this server yet, creating it...`)

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
          } catch (err) {
            await message.reply(`❌ Cannot set permissions for channel ${channel.name}: ${err.message}`)
          }
        }

        return message.reply(`✅ Muted role successfully created in the ${message.guild.name} server!`);
      } catch (err) {
        return message.reply(`❌ There was an error creating the Muted role: ${err.message}`);
      }
    } else {
      return message.reply(`❌ Muted role already exists on this server.`);
    }
  }
};
