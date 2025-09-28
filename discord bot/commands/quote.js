const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
data: new SlashCommandBuilder()
.setName('quote')
.setDescription('Küldd egy random idézetet'),


async execute(interaction) {
await interaction.deferReply();


try {
// Idézet lehívása APInól
const response = await fetch('https://api.quotegarden.org/api/v3/quotes/random');
if (!response.ok) throw new Error('API error');
const data = await response.json();


// Random szín 
const randomColor = Math.floor(Math.random() * 16777215);


const embed = new EmbedBuilder()
.setColor(randomColor)
.setTitle('🎬 Random Quote 🎮')
.setDescription(data.content)
.setFooter({ text: 'Powered by QuoteGarden API' });


await interaction.editReply({ embeds: [embed] });
} catch (error) {
await interaction.editReply('Nem sikerült az idézet lehívása.');
}
}
};