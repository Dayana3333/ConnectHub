const fs = require('fs');

module.exports = {
  name: 'log',
  description: 'Log csatorna beállítása',
  async execute(message, args, bot) {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply('❌ Nincs jogosultságod!');
    }

    let logSettings = {};
    const logFile = './logSettings.json';
    if (fs.existsSync(logFile)) {
      logSettings = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    }

    if (args[0] === 'set') {
      const type = args[1];
      const channel = message.mentions.channels.first();

      if (!['normal', 'mute'].includes(type) || !channel) {
        return message.reply('Használat: `.log set normal #csatorna` vagy `.log set mute #csatorna`');
      }

      if (!logSettings[message.guild.id]) {
        logSettings[message.guild.id] = {};
      }

      if (type === 'normal') {
        logSettings[message.guild.id].normalLog = channel.id;
      } else {
        logSettings[message.guild.id].muteLog = channel.id;
      }

      fs.writeFileSync(logFile, JSON.stringify(logSettings, null, 2));
      return message.reply(`✅ A(z) **${type}** log csatorna mostantól: ${channel}`);
    }

    return message.reply('Használat: `.log set normal #csatorna` vagy `.log set mute #csatorna`');
  }
};
