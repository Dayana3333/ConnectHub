const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch'); // make sure node-fetch installed

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Küldj egy random idézetet'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const response = await fetch('https://api.quotegarden.org/api/v3/quotes/random');
      if (!response.ok) throw new Error('API error');

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
      console.error('Quote command hiba:', err);
      await interaction.editReply(`❌ Nem sikerült az idézet lehívása: ${err.message}`);
    }
  }
};