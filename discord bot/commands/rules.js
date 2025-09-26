// commands/rules.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'rules',
  description: 'Shows the server rules in English',
  async execute(message) {
    if (message.author.bot) return;

    const embed = new EmbedBuilder()
      .setColor('DarkRed')
      .setTitle('📜 CONNECTHUB SERVER RULES')
      .setDescription(`
> 1. Toxic behavior is prohibited.  
> 2. Discrimination against others is prohibited.  
> 3. The use of vulgar expressions is prohibited.  
> 4. Sharing others’ personal data without their consent is prohibited.  
> 5. Advertising other servers is prohibited.  
> 6. Sharing adult (18+) content is prohibited.  
> 7. Spam is prohibited.  

> **Ticket rules:**  
> 4.1 Only open a ticket if you have a real problem or question, and you cannot resolve it in a few minutes or find the answer elsewhere.  
> 4.2 You may not request help from a ConnectHub staff member for problems that are outside of their responsibilities or not related to the server.  
> 4.3 Sharing personal or confidential information in tickets is prohibited, even with staff members!  

> 5. Ways to report rule violations:  
> 5.2 On Discord, you can request help or report an issue by opening a ticket in the #hibajegy channel.  

> *(We reserve the right to modify the rules!)*  
> *Not knowing the rules does not exempt you from punishment.*  
      `)
      .setFooter({ text: `Requested by: ${message.author.tag}` })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};
