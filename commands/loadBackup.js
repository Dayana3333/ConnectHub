// commands/loadBackup.js
const fs = require('fs');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'loadbackup',
  description: 'Mentett szerverstruktúra betöltése (új csatornák/szerepek létrehozása)',
  async execute(message, args) {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply('Ehhez a parancshoz admin jogosultság kell.');
    }

    const fileName = args[0]; // pl. backup_1234567890.json
    if (!fileName || !fs.existsSync(fileName)) {
      return message.reply('Nem találom ezt a backup fájlt.');
    }

    const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));

    // 1️⃣ Szerepek létrehozása
    for (const r of data.roles) {
      // létező role ID-kat nem tudsz átírni, de létrehozhatsz újat
      await message.guild.roles.create({
        name: r.name,
        color: r.color,
        permissions: new PermissionsBitField(BigInt(r.permissions)), // visszaalakítjuk BigInt-re
        position: r.position
      }).catch(console.error);
    }

    // 2️⃣ Csatornák létrehozása
    for (const c of data.channels) {
      await message.guild.channels.create({
        name: c.name,
        type: c.type,
        parent: c.parentId || null,
        position: c.position,
        topic: c.topic
      }).catch(console.error);
    }

    await message.reply('✅ Backup betöltve (szerepek/csatornák létrehozva).');
  }
};
