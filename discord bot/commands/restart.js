const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { spawn } = require('child_process');

module.exports = {
  name: "restart",
  description: "Újraindítja a botot",
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("❌ Ehhez a parancshoz admin jogosultság kell!");
    }

    const embed = new EmbedBuilder()
      .setColor('#ffa500')
      .setTitle('🔄 Bot Újraindítás')
      .setDescription('A bot újraindításra kerül...')
      .setFooter({ text: `Újraindítva: ${message.author.tag}` })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
    
    console.log('🔄 Bot újraindítva manuálisan');
    
    // Újraindítás
    setTimeout(() => {
      process.on('exit', () => {
        spawn(process.argv[0], process.argv.slice(1), {
          cwd: process.cwd(),
          detached: true,
          stdio: 'inherit'
        });
      });
      process.exit();
    }, 2000);
  }
};