// commands/giveaway.js
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

// ---------------------- ADATOK MENTÉSE ----------------------
const giveawayFile = path.join(__dirname, "../giveawayChannels.json");
let giveawayChannels = {};
if (fs.existsSync(giveawayFile)) {
  try {
    giveawayChannels = JSON.parse(fs.readFileSync(giveawayFile, "utf8"));
  } catch (err) {
    console.error("Hiba a giveawayChannels betöltésénél:", err);
  }
}
function saveChannels() {
  fs.writeFileSync(giveawayFile, JSON.stringify(giveawayChannels, null, 2));
}

const roleFile = path.join(__dirname, "../giveawayRoles.json");
let giveawayRoles = {};
if (fs.existsSync(roleFile)) {
  try {
    giveawayRoles = JSON.parse(fs.readFileSync(roleFile, "utf8"));
  } catch (err) {
    console.error("Hiba a giveawayRoles betöltésénél:", err);
  }
}
function saveRoles() {
  fs.writeFileSync(roleFile, JSON.stringify(giveawayRoles, null, 2));
}

// ---------------------- HELPER FUNKCIÓK ----------------------
function hasGiveawayRole(member) {
  const roles = giveawayRoles[member.guild.id] || [];
  return roles.some((r) => member.roles.cache.has(r));
}

function formatTime(ms) {
  if (ms <= 0) return "0 másodperc";
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const parts = [];
  if (days > 0) parts.push(`${days} nap`);
  if (hours % 24 > 0) parts.push(`${hours % 24} óra`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60} perc`);
  if (seconds % 60 > 0) parts.push(`${seconds % 60} másodperc`);
  return parts.join(" ") || "0 másodperc";
}

function msConvert(time) {
  const match = time.match(/^(\d+)([dhms])$/i);
  if (!match) return 0;
  const num = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  switch (unit) {
    case "d": return num * 24 * 60 * 60 * 1000;
    case "h": return num * 60 * 60 * 1000;
    case "m": return num * 60 * 1000;
    case "s": return num * 1000;
    default: return 0;
  }
}

// ---------------------- EXPORT ----------------------
module.exports = {
  name: "nyeremenyjatek", // main command
  async execute(message, args) {
    const commandName = message.content.slice(1).split(/ +/)[0].toLowerCase();

    // ---------------------- GIVEAWAY ROLE ADD/DEL ----------------------
    if (commandName === "nyroleadd") {
      const role = message.mentions.roles.first();
      if (!role) return message.reply("❌ Adj meg egy rangot!");
      if (!giveawayRoles[message.guild.id]) giveawayRoles[message.guild.id] = [];
      if (giveawayRoles[message.guild.id].includes(role.id))
        return message.reply("⚠️ Ez a rang már hozzá van adva.");
      giveawayRoles[message.guild.id].push(role.id);
      saveRoles();
      return message.reply(`✅ Hozzáadva a nyereményjáték admin rangokhoz: ${role}`);
    }

    if (commandName === "nyroledel") {
      const role = message.mentions.roles.first();
      if (!role) return message.reply("❌ Adj meg egy rangot!");
      if (!giveawayRoles[message.guild.id]) giveawayRoles[message.guild.id] = [];
      giveawayRoles[message.guild.id] = giveawayRoles[message.guild.id].filter(
        (r) => r !== role.id
      );
      saveRoles();
      return message.reply(
        `🗑️ Eltávolítva a nyereményjáték admin rangok közül: ${role}`
      );
    }

    // ---------------------- NYEREMÉNYJÁTÉK ----------------------
    if (commandName === "nyeremenyjatek") {
      if (!hasGiveawayRole(message.member))
        return message.reply("❌ Nincs jogosultságod ehhez a parancshoz!");

      const subcommand = args.shift();
      if (!subcommand)
        return message.reply("❌ Használat: .nyeremenyjatek set/del/start ...");

      // --- SET ---
      if (subcommand === "set") {
        const channel = message.mentions.channels.first();
        if (!channel)
          return message.reply("❌ Kérlek, jelölj meg egy csatornát!");
        giveawayChannels[message.guild.id] = channel.id;
        saveChannels();
        return message.reply(`✅ A nyereményjáték csatorna beállítva: ${channel}`);
      }

      // --- DEL ---
      if (subcommand === "del") {
        if (!giveawayChannels[message.guild.id])
          return message.reply(
            "❌ Nincs beállítva nyereményjáték csatorna ezen a szerveren."
          );
        delete giveawayChannels[message.guild.id];
        saveChannels();
        return message.reply("🗑️ A nyereményjáték csatorna törölve lett!");
      }

      // --- START ---
      if (subcommand === "start") {
        const channelId = giveawayChannels[message.guild.id];
        if (!channelId)
          return message.reply(
            "❌ Először állítsd be a nyereményjáték csatornát: .nyeremenyjatek set #csatorna"
          );

        const giveawayChannel = message.guild.channels.cache.get(channelId);
        if (!giveawayChannel)
          return message.reply("❌ Nem találom a beállított csatornát!");

        const winnerCountArg = args.pop();
        const timeArg = args.pop();
        const prize = args.join(" ");

        const winnerCountMatch = winnerCountArg?.match(/^(\d+)\s*fő$/i);
        if (!winnerCountMatch)
          return message.reply("❌ Használd a 'fő' végződést (pl: 1fő)");

        const timeMatch = timeArg?.match(/^(\d+)([dhms])$/i);
        if (!timeMatch)
          return message.reply(
            "❌ Érvénytelen időformátum! (pl: 1h, 30m, 10s)"
          );

        if (!prize) return message.reply("❌ Adj meg egy nyereményt!");

        const winnerCount = parseInt(winnerCountMatch[1]);
        const duration = msConvert(timeArg);
        if (duration === 0) return message.reply("❌ Érvénytelen idő!");

        const endTime = Date.now() + duration;
        const giveawayId = `${message.id}_${Date.now()}`;

        const button = new ButtonBuilder()
          .setCustomId(`giveaway_${giveawayId}`)
          .setLabel("Csatlakozom")
          .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(button);

        const initialEmbed = new EmbedBuilder()
          .setTitle("<a:nyeremenyjatek:1419291413127888956> Nyereményjáték")
          .setDescription(
            `**Nyeremény:** ${prize}\n**Nyertesek száma:** ${winnerCount}\n**Hátralévő idő:** ${formatTime(
              duration
            )}\n\nKattints a "Csatlakozom" gombra!`
          )
          .setColor("#d18be2")
          .setTimestamp(endTime);

        const giveawayMessage = await giveawayChannel.send({
          embeds: [initialEmbed],
          components: [row],
        });

        const participants = new Set();
        let ended = false;

        const endGiveaway = async () => {
          if (ended) return;
          ended = true;

          const winners = Array.from(participants)
            .sort(() => Math.random() - 0.5)
            .slice(0, winnerCount);

          const winnerText =
            winners.length > 0
              ? winners.map((w) => `<@${w}>`).join(", ")
              : "Senki sem nyert";

          const finalEmbed = new EmbedBuilder()
            .setTitle("<a:medal:1419795403552985248> Nyereményjáték vége")
            .setDescription(
              `**Nyeremény:** ${prize}\n**Nyertesek:** ${winnerText}\n**Résztvevők:** ${participants.size}`
            )
            .setColor("#FFD700")
            .setTimestamp();

          try {
            await giveawayMessage.edit({ embeds: [finalEmbed], components: [] });
            if (winners.length > 0) {
              await giveawayChannel.send(
                `<a:medal:1419795403552985248> **Gratulálok a nyerteseknek!**\n${winnerText}`
              );
            } else {
              await giveawayChannel.send(
                "😢 Senki sem vett részt a nyereményjátékban."
              );
            }
          } catch (error) {
            console.error("Hiba a véglegesítéskor:", error);
          }
        };

        const updateInterval = setInterval(async () => {
          if (ended) {
            clearInterval(updateInterval);
            return;
          }
          const remaining = endTime - Date.now();
          if (remaining <= 0) {
            clearInterval(updateInterval);
            endGiveaway();
            return;
          }

          const updatedEmbed = new EmbedBuilder()
            .setTitle("<a:nyeremenyjatek:1419291413127888956> Nyereményjáték")
            .setDescription(
              `**Nyeremény:** ${prize}\n**Nyertesek száma:** ${winnerCount}\n**Hátralévő idő:** ${formatTime(
                remaining
              )}\n\nKattints a "Csatlakozom" gombra!`
            )
            .setColor("#d18be2")
            .setTimestamp(endTime);

          giveawayMessage.edit({ embeds: [updatedEmbed] });
        }, 1000);

        const collector = giveawayMessage.createMessageComponentCollector({
          filter: (i) => i.customId === `giveaway_${giveawayId}`,
          time: duration,
        });

        collector.on("collect", async (i) => {
          if (participants.has(i.user.id)) {
            i.reply({ content: "❌ Már részt veszel!", ephemeral: true });
            return;
          }
          participants.add(i.user.id);
          i.reply({ content: "✅ Sikeresen csatlakoztál!", ephemeral: true });
        });

        collector.on("end", endGiveaway);
      }
    }
  },
};