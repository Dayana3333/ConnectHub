const fs = require('fs');

module.exports = {
  name: 'join',
  description: 'Join log beállítása',
  async execute(message, args, bot) {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply('Nincs jogosultságod ehhez a parancshoz.');
    }

    if (args[0] !== 'log') {
      return message.reply('Használat: `.join log #csatorna`');
    }

    const channel = message.mentions.channels.first();
    if (!channel) {
      return message.reply('Kérlek jelölj meg egy csatornát!');
    }

    // beállítás mentése
    const settingsPath = './joinSettings.json';
    const joinSettings = fs.existsSync(settingsPath)
      ? JSON.parse(fs.readFileSync(settingsPath))
      : {};

    joinSettings[message.guild.id] = channel.id;

    fs.writeFileSync(settingsPath, JSON.stringify(joinSettings, null, 2));
    message.reply(`✅ Join log csatorna beállítva ide: ${channel}`);
  }
};
