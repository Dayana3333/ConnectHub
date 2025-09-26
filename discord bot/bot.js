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
  AuditLogEvent
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
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const prefix = ".";
client.commands = new Collection();

// ---------------------- PARANCSOK BETÖLTÉSE ----------------------
const commandsPath = path.join(__dirname, "commands");
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if (command.name && command.execute) {
      client.commands.set(command.name, command);
      console.log(`✅ Betöltve: ${command.name}`);
    } else {
      console.warn(`⚠️ Hibás command fájl: ${file}`);
    }
  }
}

// ---------------------- ÜZENET KEZELÉS ----------------------
client.on("messageCreate", async (message) => {
  // 1. Ne reagáljon saját vagy más botokra
  if (message.author.bot) return;

  // 2. Csak akkor reagáljon, ha a prefix szerepel az elején
  if (!message.content.startsWith(prefix)) return;

  // 3. Vágd le a prefixet és parancsot külön
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();

  // 4. Ha nincs parancs, csak a prefix lett beírva, ne csináljon semmit
  if (!commandName) return;

  // 5. Keresd meg a parancsot
  const command = client.commands.get(commandName);
  if (!command) return; // ismeretlen parancs

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply("Hiba történt a parancs futtatása közben.");
  }
});

// ---------------------- BOT INDÍTÁSA ----------------------
client.login(config.token);
