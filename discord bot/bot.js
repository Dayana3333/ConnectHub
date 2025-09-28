// ---------------------- IMPORTOK ----------------------
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  ActivityType,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");


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
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
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

// Attach watch.js for bad word filtering RICSI TETTE IDE
const watch = require("./events/watch.js");
watch.execute(client);

// Attach spam.js for spam detection
const spam = require("./events/spam.js")
spam.execute(client)

// Attach logHandler.js for log handling
const logHandler = require("./events/logHandler.js");
logHandler.execute(client)

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
  const linkPattern = /((https?:\/\/)|www\.)[^\s]+/i;
  const gifPattern = /\.gif(\?.*)?$/i;
  const allowedDomains = /(tenor\.com|giphy\.com|cdn\.discordapp\.com)/i;

  if (
    linkPattern.test(message.content) &&
    !gifPattern.test(message.content) &&
    !allowedDomains.test(message.content)
  ) {
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

  if (!message.content.startsWith(prefix) || message.content.trim() === prefix) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();
  if (!commandName) return;

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

// ---------------------- AKTIVITÁSOK ----------------------
const activities = [
  { name: ".help | Bot parancsok megtekintése.", type: ActivityType.Playing },
  { name: "ConnectHub szerver", type: ActivityType.Watching },
  { name: "új tagokat a szerveren.", type: ActivityType.Listening },
];

client.on("ready", () => {
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