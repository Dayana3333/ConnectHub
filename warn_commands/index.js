const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const fs = require("fs");
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`✅ Bejelentkezve: ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  const prefix = '.';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return console.log(`Command felismerve: ${commandName} ❌`);

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('⚠️ Hiba történt a parancs végrehajtása közben!');
  }

/*const statuses = [
    { name: '.help | parancsok megtekintése.', type: ActivityType.Playing },
    { name: '<:newconnectlogo:1414494951294636102> ConnectHub <:newconnectlogo:1414494951294636102>', type: ActivityType.Watching },
    { name: 'Visual Studio Code', type: ActivityType.Listening },
  ];

  let i = 0;
  setInterval(() => {
    const status = statuses[i];
    bot.user.setActivity(status);
    i = (i + 1) % statuses.length; // sorrendben megy körbe
  }, 20 * 1000); // 30 mp-enként vált*/
});


client.login(process.env.TOKEN);
