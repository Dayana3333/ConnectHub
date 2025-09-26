const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: "stop",
  description: "Leállítja a botot teljesen",
  async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("❌ Ehhez a parancshoz admin jogosultság kell!");
    }
 
  const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('🛑 Bot Leállítás')
      .setDescription('A bot leállításra kerül...')
      .setFooter({ text: `Leállítva: ${message.author.tag}` })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
    
    console.log('🛑 Bot manuálisan leállítva');
    process.exit(0);
  }
};