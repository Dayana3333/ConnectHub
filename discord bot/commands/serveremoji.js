const { EmbedBuilder } = require('discord.js');

 module.exports = {
  name: "emojilist",
  description: "Listázza a szerver elérhető emojijait",
  async execute(message) {
    const emojis = message.guild.emojis.cache;
    
    if (emojis.size === 0) {
      return message.reply("❌ Nincsenek custom emojik ezen a szerveren!");
    }
    
    const emojiList = emojis.map(emoji => 
      `${emoji} - \`${emoji.identifier}\``
    ).join('\n');
    
    const embed = new EmbedBuilder()
      .setTitle("🎭 Szerver Emojik")
      .setDescription(emojiList)
      .setColor("#0099ff");
    
    message.reply({ embeds: [embed] });
  }
};