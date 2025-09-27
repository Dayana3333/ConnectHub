// setupMutedRole.js
const { ChannelType } = require('discord.js');

module.exports = {
  name: 'setupmutedrole',
  description: 'Creates the Muted role and applies it to all channels',
  async execute(message, args, client) {
    // Check bot permissions
    if (!message.guild.members.me.permissions.has('Administrator')) {
      return await message.reply(
        `❌ I don't have Administrator role to create the Muted role!`
      );
    }

    let mutedRole = message.guild.roles.cache.find(r => r.name === "Muted");

    if (!mutedRole) {
      try {
        await message.reply(
          `Muted role doesn't exist on this server yet, creating it...`
        );

        mutedRole = await message.guild.roles.create({
          name: "Muted",
          color: "#555555",
          reason: "Required for spam protection",
          permissions: [] // <-- ensure no base permissions
        });

        // Only include channels where permission overwrites are valid
        const editableChannels = message.guild.channels.cache.filter(ch =>
          ch.type === ChannelType.GuildText ||
          ch.type === ChannelType.GuildVoice ||
          ch.type === ChannelType.GuildCategory ||
          ch.type === ChannelType.GuildStageVoice ||
          ch.type === ChannelType.GuildForum
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
            await message.reply(
              `❌ Cannot set permissions for channel ${channel.name}: ${err.message}`
            );
          }
        }

        return await message.reply(
          `✅ Muted role successfully created in the ${message.guild.name} server!`
        );
      } catch (err) {
        return await message.reply(
          `❌ There was an error creating the Muted role: ${err.message}`
        );
      }
    } else {
      return await message.reply(
        `⚠️ Muted role already exists on this server.`
      );
    }
  }
};
