// commands/say.js
const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: 'say',
  description: 'Elküldi a megadott szöveget a csatornába.',
  async execute(message, args, bot) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("❌ Ehhez a parancshoz admin jogosultság kell!");
    }
    const text = args.join(' ');
    if (!text) return message.reply('Adj meg szöveget, amit mondjak!');
    try {
      await message.delete(); // törli a felhasználó üzenetét
      await message.channel.send(text); // elküldi a szöveget
    } catch (err) {
      console.error('Hiba a .say parancsnál:', err);
      message.reply('Hiba történt.');
    }
  }
};
