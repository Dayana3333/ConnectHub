// commands/szabalyzat.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'szab', // így .szabályzat lesz a parancs neve
  description: 'Megjeleníti a szerver szabályzatát magyarul',
  async execute(message) {
    if (message.author.bot) return;

    const embed = new EmbedBuilder()
      .setColor('DarkRed')
      .setTitle('📜 CONNECTHUB SZERVER SZABÁLYZAT')
      .setDescription(`
> 1. A toxikus viselkedés tilos.  
> 2. Másokkal szembeni diszkrimináció tilos.  
> 3. Trágár kifejezések használata tilos.  
> 4. Mások személyes adatainak megosztása hozzájárulás nélkül tilos.  
> 5. Más szerverek reklámozása tilos.  
> 6. Felnőtt (18+) tartalom megosztása tilos.  
> 7. Spamelés tilos.  

> **Jegyszabályok:**  
> 4.1 Csak akkor nyiss jegyet, ha valódi problémád vagy kérdésed van, amit nem tudsz néhány percen belül megoldani, és máshol sem találod a választ.  
> 4.2 Nem kérhetsz segítséget ConnectHub személyzettől olyan problémákban, amelyek nem tartoznak a feladatkörükbe vagy nem kapcsolódnak a szerverhez.  
> 4.3 Személyes vagy bizalmas információk megosztása jegyekben tilos, még a személyzettel is!  

> **Szabálysértések jelentése:**  
> 5.2 Discordon segítséget kérhetsz vagy problémát jelenthetsz jegy nyitásával a #hibajegy csatornában.  

> *(Fenntartjuk a jogot a szabályok módosítására!)*  
> *A szabályok nem ismerete nem mentesít a büntetés alól.*  
      `)
      .setFooter({ text: `Kérte: ${message.author.tag}` })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};
