const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Küldj egy random idézetet'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const response = await fetch('https://api.kanye.rest/');
      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const quote = data.quote || "Nincs idézet elérhető."; // ✅ kanye.rest provides 'quote'
      const author = "Kanye West"; // static, because API doesn’t return author

      const randomColor = Math.floor(Math.random() * 16777215);

      const embed = new EmbedBuilder()
        .setColor(randomColor)
        .setTitle('🎬 Random Quote 🎮')
        .setDescription(`"${quote}"\n— **${author}**`)
        .setFooter({ text: 'Powered by Kanye REST API' });

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error('Quote command error:', err);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(`❌ Nem sikerült az idézet lehívása: ${err.message}`);
      } else {
        await interaction.reply(`❌ Nem sikerült az idézet lehívása: ${err.message}`);
      }
    }
  }
};
