// commands/dm.js
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'dm',
  description: 'Privát üzenetet küld embedben a megadott felhasználónak',
  async execute(message, args) {
    // csak admin/mod küldhessen DM-et
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ Nincs jogosultságod ehhez a parancshoz!');
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply('Használat: `.dm @felhasználó szöveg`');

    // DM szövege
    const dmMessage = args.slice(1).join(' ');
    if (!dmMessage) return message.reply('Adj meg szöveget is!');

    // töröljük a parancs üzenetét
    try { await message.delete(); } catch (err) { console.error(err); }

    // embed létrehozása
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`📩 Üzenet érkezett a(z) ${message.guild.name} szerverről`)
      .setDescription(dmMessage)
      .setFooter({ text: `Üzenetet küldte: ${message.author.tag}` })
      .setTimestamp();

    try {
      await member.send({ embeds: [embed] });
      await message.channel.send(`✅ Üzenet elküldve ${member}-nek privátban.`);
    } catch (err) {
      console.error('Nem sikerült DM-et küldeni:', err);
      await message.channel.send('⚠️ Nem sikerült elküldeni a DM-et.');
    }
  },
};
