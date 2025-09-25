const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "reakcio",
  description: "Reaction role üzenet létrehozása pingelt rangokkal",
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("❌ Ehhez a parancshoz admin jogosultság kell!");
    }

    if (args.length < 2 || args.length % 2 !== 0) {
      return message.reply("Használat: `.reakcio <emoji> <@rang> <emoji> <@rang> ...`");
    }

    const roles = {};
    let description = "Reagálj az alábbi emojikkal a rang felvételéhez:\n\n";

    for (let i = 0; i < args.length; i += 2) {
      const rawEmoji = args[i];
      const roleMention = args[i + 1];
      const role = message.mentions.roles.get(roleMention.replace(/[<@&>]/g, ""));
      
      if (!role) {
        return message.reply(`❌ Nem találom ezt a rangot: ${roleMention}`);
      }

      // Emoji kinyerése (Unicode vagy custom)
      let emojiKey, emojiDisplay;
      
      // Custom emoji regex (both static and animated)
      const customMatch = rawEmoji.match(/^<a?:(\w+):(\d+)>$/);
      
      if (customMatch) {
        // customMatch[1] = emoji name, customMatch[2] = emoji ID
        emojiKey = customMatch[2]; // Use ID as key
        emojiDisplay = rawEmoji;   // Keep the full format for display
      } else {
        // Unicode emoji
        emojiKey = rawEmoji;
        emojiDisplay = rawEmoji;
      }

      roles[emojiKey] = role.id;
      description += `${emojiDisplay} - ${role}\n`;
    }

    const embed = new EmbedBuilder()
      .setTitle("🎭 Ping-rangok")
      .setDescription(description)
      .setColor("#042632")
      .setFooter({ text: "Kattints az emojira amelyikről értesitést szeretnél kapni." });

    const msg = await message.channel.send({ embeds: [embed] });

    // Emojik hozzáadása
    for (const emojiKey of Object.keys(roles)) {
      try {
        // Check if it's a custom emoji (numeric ID)
        if (/^\d+$/.test(emojiKey)) {
          // Find the custom emoji in the guild
          const customEmoji = message.guild.emojis.cache.get(emojiKey);
          if (customEmoji) {
            await msg.react(customEmoji);
          } else {
            console.error(`Saját emoji nem található: ${emojiKey}`);
          }
        } else {
          // Unicode emoji
          await msg.react(emojiKey);
        }
      } catch (err) {
        console.error("Nem sikerült reagálni:", err);
        message.reply(`❌ Hiba történt az emoji hozzáadásakor: ${err.message}`);
      }
    }

    // Reaction collector
    const collector = msg.createReactionCollector({ 
      dispose: true,
      filter: (reaction, user) => !user.bot
    });

    collector.on("collect", async (reaction, user) => {
      if (reaction.partial) {
        try {
          await reaction.fetch();
        } catch (err) {
          console.error("Nem tudtam betölteni a reaction-t:", err);
          return;
        }
      }

      const emojiId = reaction.emoji.id || reaction.emoji.name;
      const roleId = roles[emojiId];
      
      if (!roleId) return;

      const member = await message.guild.members.fetch(user.id);
      if (member) {
        try {
          await member.roles.add(roleId);
          console.log(`✅ Rang hozzáadva: ${user.tag} -> ${roleId}`);
        } catch (err) {
          console.error("Hiba a rang hozzáadásakor:", err);
        }
      }
    });

    collector.on("remove", async (reaction, user) => {
      if (reaction.partial) {
        try {
          await reaction.fetch();
        } catch (err) {
          console.error("Nem tudtam betölteni a reaction-t:", err);
          return;
        }
      }

      const emojiId = reaction.emoji.id || reaction.emoji.name;
      const roleId = roles[emojiId];
      
      if (!roleId) return;

      const member = await message.guild.members.fetch(user.id);
      if (member) {
        try {
          await member.roles.remove(roleId);
          console.log(`❌ Rang eltávolítva: ${user.tag} -> ${roleId}`);
        } catch (err) {
          console.error("Hiba a rang eltávolításakor:", err);
        }
      }
    });

    await message.delete().catch(console.error);
  }
};