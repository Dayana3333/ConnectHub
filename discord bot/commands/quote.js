const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Küldj egy random idézetet'),

  async execute(interaction) {
    // Immediately defer to avoid Discord timeout
    await interaction.deferReply();

    try {
      const response = await fetch('https://api.quotable.io');
      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const quote = data.data?.[0]?.quoteText || "Nincs idézet elérhető.";
      const author = data.data?.[0]?.quoteAuthor || "Ismeretlen";

      const randomColor = Math.floor(Math.random() * 16777215);

      const embed = new EmbedBuilder()
        .setColor(randomColor)
        .setTitle('🎬 Random Quote 🎮')
        .setDescription(`"${quote}"\n— **${author}**`)
        .setFooter({ text: 'Powered by QuoteGarden API' });

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error('Quote command error:', err);
      // Ensure Discord gets a reply even if the API fails
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(`❌ Nem sikerült az idézet lehívása: ${err.message}`);
      } else {
        await interaction.reply(`❌ Nem sikerült az idézet lehívása: ${err.message}`);
      }
    }
  }
};