const fs = require('fs');

module.exports = {
    name: 'log',
    description: 'Log csatorna beállítása',
    async execute(message, args, bot) {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ Nincs jogosultságod!');
        }

        // betöltjük az eddigi beállításokat
        let logSettings = {};
        if (fs.existsSync('./logSettings.json')) {
            logSettings = JSON.parse(fs.readFileSync('./logSettings.json', 'utf8'));
        }

        // parancs: .log set normal #csatorna
        // vagy: .log set mute #csatorna
        if (args[0] === 'set') {
            const type = args[1]; // normal vagy mute
            const channel = message.mentions.channels.first();

            if (!['normal', 'mute'].includes(type) || !channel) {
                return message.reply('Használat: `.log set normal #csatorna` vagy `.log set mute #csatorna`');
            }

            // guild object létrehozása, ha még nincs
            if (!logSettings[message.guild.id]) {
                logSettings[message.guild.id] = {};
            }

            if (type === 'normal') {
                logSettings[message.guild.id].normalLog = channel.id;
            } else if (type === 'mute') {
                logSettings[message.guild.id].muteLog = channel.id;
            }

            fs.writeFileSync('./logSettings.json', JSON.stringify(logSettings, null, 2));

            return message.reply(`✅ A(z) **${type}** log csatorna mostantól: ${channel}`);
        }

        return message.reply('Használat: `.log set normal #csatorna` vagy `.log set mute #csatorna`');
    }
};
