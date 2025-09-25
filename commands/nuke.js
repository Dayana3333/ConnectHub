// commands/nuke.js
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'nuke',
  description: 'MINDEN csatorna és kategória törlése (veszélyes!)',
  async execute(message) {
    // csak admin használhatja
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ Ehhez nincs jogosultságod!');
    }

    // megerősítés
    await message.reply('⚠️ Biztosan törölni akarod az ÖSSZES csatornát és kategóriát? Írd be `igen` megerősítésként (30mp).');

    const filter = m => m.author.id === message.author.id && m.content.toLowerCase() === 'igen';
    const collected = await message.channel.awaitMessages({ filter, max: 1, time: 30000 }).catch(() => null);

    if (!collected || collected.size === 0) {
      return message.reply('❌ Művelet megszakítva.');
    }

    // törlés
    message.guild.channels.cache.forEach(async ch => {
      try {
        await ch.delete(`Nuke parancs által indítva: ${message.author.tag}`);
      } catch (err) {
        console.error(`Nem sikerült törölni a csatornát ${ch.name}:`, err);
      }
    });

    return message.channel.send('💣 **NUKE lefutott.** Minden csatorna/kategória törlésre került.');
  },
};
