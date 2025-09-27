const { words: badWords } = require('../badwords.json');

module.exports = {
  name: 'nick',
  description: 'Megváltoztatja egy adott felhasználó becenevét vagy törli azt.',
  async execute(message, args, bot) {
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('Jelölj meg egy felhasználót, akinek változtatni szeretnéd a becenevét.');
    }

    args.shift();

    if (args.length === 0 || args[0].toLowerCase() === 'clear') {
      try {
        await member.setNickname(null);
        await message.react('✅');
        return message.channel.send(`Sikeresen töröltem **${member.user.tag}** becenevét.`);
      } catch (error) {
        console.error(error);
        return message.reply('Nem sikerült törölni a becenevet. Nincs engedélyem vagy a felhasználó magasabb rangú.');
      }
    }

    const newNick = args.join(' ');
    const lowerNick = newNick.toLowerCase();

    // Ellenőrzés: egyszavas + kifejezés is
    if (badWords.some(word => lowerNick.includes(word))) {
      return message.reply('Ez a becenév tiltott szavakat tartalmaz, kérlek válassz másikat.');
    }

    try {
      const updatedMember = await member.setNickname(newNick);
      await message.react('✅');
      message.channel.send(
        `Sikeresen megváltoztattam **${member.user.tag}** becenevét erre: **${updatedMember.nickname ?? 'nincs becenév'}**`
      );
    } catch (error) {
      console.error(error);
      message.reply('Nem sikerült módosítani a becenevet. Nincs engedélyem vagy a felhasználó magasabb rangú.');
    }
  }
};
