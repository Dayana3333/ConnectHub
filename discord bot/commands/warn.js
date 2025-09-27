// commands/warn.js
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { punishments } = require('../mybot_project/utils/spamData.js');

module.exports = {
  name: 'warn',
  description: 'Warnol vagy nulláz warnokat (reset)',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ Nincs jogosultságod ehhez a parancshoz!');
    }

    if (!args.length) {
      return message.reply('Használat: `.warn @felhasználó` vagy `.warn reset @felhasználó`');
    }

    // ======= RESET =======
    if (args[0].toLowerCase() === 'reset') {
      const member = message.mentions.members.first();
      if (!member) return message.reply('Adj meg egy felhasználót pingelve! Pl.: `.warn reset @Felhasználó`');
      punishments.delete(member.id);
      const embed = new EmbedBuilder()
        .setTitle('♻️ Figyelmeztetések nullázva')
        .setColor('Green')
        .addFields(
          { name: 'Felhasználó', value: `${member}`, inline: true },
          { name: 'Moderátor', value: `${message.author}`, inline: true },
          { name: 'Státusz', value: 'Minden figyelmeztetés törölve ✅', inline: false }
        )
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    }

    // ======= WARN =======
    const { Client, GatewayIntentBits, Partials } = require('discord.js');

  // Initialize the client
  const client = new Client({
      intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildMembers
      ],
      partials: [Partials.Channel]
  });

  // Map to store warnings
  const punishments = new Map();

  client.on('message', async (message) => {
      if (message.author.bot) return; // Ignore bot messages
      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();

      if (command === 'warn') {
          // Felhasználó pingelése
          const member = message.mentions.members.first();
          if (!member) return message.reply('Adj meg egy felhasználót pingelve! Pl.: `.warn @Felhasználó`');

          // Warn számoló
          let warns = punishments.get(member.id) || 0;
          warns++;
          punishments.set(member.id, warns);

          // Csatorna értsítő
          message.channel.send(`${member.user.tag} figyelmeztetve lett. (${warns} figyelmeztetés összesen)`);
        }
  });

    // ======= SZANKCIÓK =======
    try {
      // 3 warn -> 30 perc timeout
      if (warns === 3) {
        await member.timeout(30 * 60 * 1000, '3 warn – 30 perc felfüggesztés');
        await member.send(`🔇 30 perces felfüggesztést kaptál a(z) ${message.guild.name} szerveren (3 figyelmeztetés).`);
        await message.channel.send(`${member} 30 percre felfüggesztve (timeout) 3 figyelmeztetés miatt.`);
      }

      // +2 warn (5 összesen) -> 1 óra timeout
      if (warns === 5) {
        await member.timeout(60 * 60 * 1000, '5 warn – 1 óra felfüggesztés');
        await member.send(`🔇 1 órás felfüggesztést kaptál a(z) ${message.guild.name} szerveren (5 figyelmeztetés).`);
        await message.channel.send(`${member} 1 órára felfüggesztve (timeout) 5 figyelmeztetés miatt.`);
      }

      // +1 warn (6 összesen) -> végleges felfüggesztés (például 7 nap)
      if (warns >= 6) {
        await member.timeout(7 * 24 * 60 * 60 * 1000, '6+ warn – hosszú felfüggesztés');
        await member.send(`🚫 Hosszú felfüggesztést kaptál a(z) ${message.guild.name} szerveren spamelés miatt.`);
        await message.channel.send(`${member} hosszú időre felfüggesztve (timeout) 6+ figyelmeztetés miatt.`);
      }
    } catch (err) {
      console.error('Nem sikerült timeoutolni a tagot:', err);
    }
  },
};
