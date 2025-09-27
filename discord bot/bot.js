// ---------------------- IMPORTOK ----------------------
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Collection,
  ActivityType,
  AuditLogEvent,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const messageDelete = require("./events/messageDelete");

// ---------------------- BOT LÉTREHOZÁSA ----------------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const prefix = ".";
client.commands = new Collection();

// ---------------------- PARANCSOK BETÖLTÉSE ----------------------
const commandsPath = path.join(__dirname, "commands");
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.name && command.execute) {
      client.commands.set(command.name, command);
      console.log(`✅ Betöltve: ${command.name}`);
    } else {
      console.warn(`⚠️ Hibás command fájl: ${file}`);
    }
  }
}

// ---------------------- ADATOK MENTÉSE ----------------------
const giveawayFile = path.join(__dirname, "giveawayChannels.json");
let giveawayChannels = {};
if (fs.existsSync(giveawayFile)) {
  try {
    giveawayChannels = JSON.parse(fs.readFileSync(giveawayFile, "utf8"));
  } catch (err) {
    console.error("Hiba a giveawayChannels.json betöltésekor:", err);
  }
}
function saveChannels() {
  fs.writeFileSync(giveawayFile, JSON.stringify(giveawayChannels, null, 2));
}

const roleFile = path.join(__dirname, "giveawayRoles.json");
let giveawayRoles = {};
if (fs.existsSync(roleFile)) {
  try {
    giveawayRoles = JSON.parse(fs.readFileSync(roleFile, "utf8"));
  } catch (err) {
    console.error("Hiba a giveawayRoles.json betöltésekor:", err);
  }
}
function saveRoles() {
  fs.writeFileSync(roleFile, JSON.stringify(giveawayRoles, null, 2));
}

// ---------------------- IDŐ ÁTALAKÍTÓ ----------------------
function ms(time) {
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

// ---------------------- LOG BEOLVASÁS ----------------------
function getLogSettings(guildId) {
  try {
    const data = fs.readFileSync("./logSettings.json", "utf8");
    const settings = JSON.parse(data);
    return settings[guildId] || null;
  } catch {
    return null;
  }
}

// ---------------------- ÜZENET KEZELÉS ----------------------
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // 🔒 ANTI-LINK
  const linkPattern =
    /(https?:\/\/)?(www\.)?(discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9]+/i;
    /(https?:\/\/)?(www\.)?(tenor\.gg|tenor\.com\/gif)\/[a-zA-Z0-9]+/i;
  if (linkPattern.test(message.content)) {
    try {
      await message.delete();
      await message.channel.send({
        content: `❌ <@${message.author.id}> Linkek küldése nem engedélyezett!`,
      });
    } catch (err) {
      console.error("Nem sikerült törölni a linket:", err);
    }
    return;
  }

  if (!message.content.startsWith(prefix)) return;

  // ha csak a prefixet írja be valaki, ne válaszoljon
  if (message.content.trim() === prefix) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();
  if (!commandName) return;

  // ---------------------- GIVEAWAY ROLE ADD/DEL ----------------------
  if (commandName === "nyroleadd") {
    const role = message.mentions.roles.first();
    if (!role) return message.reply("❌ Adj meg egy rangot!");
    if (!giveawayRoles[message.guild.id]) giveawayRoles[message.guild.id] = [];
    if (giveawayRoles[message.guild.id].includes(role.id)) {
      return message.reply("⚠️ Ez a rang már hozzá van adva.");
    }
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

  function hasGiveawayRole(member) {
    const roles = giveawayRoles[message.guild.id] || [];
    return roles.some((r) => member.roles.cache.has(r));
  }

  // ---------------------- GIVEAWAY ----------------------
  if (commandName === "nyeremenyjatek") {
    if (!hasGiveawayRole(message.member)) {
      return message.reply("❌ Nincs jogosultságod ehhez a parancshoz!");
    }

    const subcommand = args.shift();
    if (!subcommand) {
      return message.reply("❌ Használat: .nyeremenyjatek set/del/start ...");
    }

    if (subcommand === "set") {
      const channel = message.mentions.channels.first();
      if (!channel) return message.reply("❌ Kérlek, jelölj meg egy csatornát!");
      giveawayChannels[message.guild.id] = channel.id;
      saveChannels();
      return message.reply(`✅ A nyereményjáték csatorna beállítva: ${channel}`);
    }

    if (subcommand === "del") {
      if (!giveawayChannels[message.guild.id]) {
        return message.reply(
          "❌ Nincs beállítva nyereményjáték csatorna ezen a szerveren."
        );
      }
      delete giveawayChannels[message.guild.id];
      saveChannels();
      return message.reply("🗑️ A nyereményjáték csatorna törölve lett!");
    }

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

      const winnerCountMatch = winnerCountArg.match(/^(\d+)\s*fő$/i);
      if (!winnerCountMatch)
        return message.reply("❌ Használd a 'fő' végződést (pl: 1fő)");

      const timeMatch = timeArg.match(/^(\d+)([dhms])$/i);
      if (!timeMatch)
        return message.reply("❌ Érvénytelen időformátum! (pl: 1h, 30m, 10s)");

      if (!prize) return message.reply("❌ Adj meg egy nyereményt!");

      const winnerCount = parseInt(winnerCountMatch[1]);
      const duration = ms(timeArg);
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
    return;
  }

  // ---------------------- PARANCS FUTTATÁS ----------------------
  const command = client.commands.get(commandName);
  if (command) {
    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply("❌ Hiba történt a parancs futtatása közben.");
    }
  }
});

// ---------------------- LOG KEZELÉS ----------------------
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

// ---------------------- AKTIVITÁSOK ----------------------
const activities = [
  { name: ".help | Bot parancsok megtekintése.", type: ActivityType.Playing },
  { name: "ConnectHub szerver", type: ActivityType.Watching },
  { name: "új tagokat a szerveren.", type: ActivityType.Listening },
];

client.on("clientReady", () => {
  console.log(`✅ Bejelentkezve: ${client.user.tag}`);

  let activityIndex = 0;
  client.user.setActivity(activities[activityIndex].name, { type: activities[activityIndex].type });

  setInterval(() => {
    activityIndex = (activityIndex + 1) % activities.length;
    const a = activities[activityIndex];
    client.user.setActivity(a.name, { type: a.type });
  }, 15000);
});

// ---------------------- BOT INDÍTÁSA ----------------------
client.login(config.token);
