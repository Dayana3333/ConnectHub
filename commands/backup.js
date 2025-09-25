// commands/backup.js
const fs = require('fs');

module.exports = {
  name: 'backup',
  description: 'Szerver struktúrájának mentése JSON-ba',
  async execute(message) {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply('Ehhez a parancshoz admin jogosultság kell.');
    }

    const guild = message.guild;

    // szerepek
    const roles = guild.roles.cache.map(role => ({
      id: role.id,
      name: role.name,
      color: role.color,
      // BigInt -> string
      permissions: role.permissions.bitfield.toString(),
      position: role.position
    }));

    // csatornák
    const channels = guild.channels.cache.map(channel => ({
      id: channel.id,
      name: channel.name,
      type: channel.type,
      parentId: channel.parentId,
      position: channel.position,
      topic: channel.topic || null
    }));

    const backupData = {
      guildId: guild.id,
      guildName: guild.name,
      createdAt: guild.createdAt,
      roles,
      channels
    };

    const fileName = `backup_${guild.id}_${Date.now()}.json`;
    fs.writeFileSync(fileName, JSON.stringify(backupData, null, 2));

    await message.reply(`✅ Backup elkészült: \`${fileName}\``);
  }
};
