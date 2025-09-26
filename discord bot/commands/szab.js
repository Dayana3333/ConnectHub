// commands/szab.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'szab',
  description: 'Kijelzi a szerver szabályzatát magyarul',
  async execute(message) {
    if (message.author.bot) return;

    const embed = new EmbedBuilder()
      .setColor('DarkRed')
      .setTitle('📜 CONNECTHUB SZERVER SZABÁLYZAT')
      .setDescription(`

> 1. Toxikus viselkedés tilos.  
> 2. Mások diszkriminálása tilos.  
> 3. Trágár kifejezések használata tilos.  
> 4. Mások személyes adatainak megosztása engedély nélkül tilos.  
> 5. Más Discord szerverek reklámozása tilos.  
> 6. Felnőtt (18+) tartalmak megosztása tilos.  
> 7. Spamelés tilos.  

> **Hibajegy (ticket) szabályzat:**  
> 4.1 Csak akkor nyiss hibajegyet, ha valódi problémád vagy kérdésed van, amit nem tudsz pár perc alatt megoldani, vagy máshol választ találni rá.  
> 4.2 Nem kérhetsz segítséget a ConnectHub csapattagjaitól olyan problémákra, amik nem tartoznak a szerverhez vagy az ő felelősségi körükbe.  
> 4.3 Személyes vagy bizalmas információ megosztása hibajegyben még staff taggal is tilos!  

> 5. Szabálysértések jelentése:  
> 5.2 Discordon hibajegyet nyithatsz a <#1421149595748139068> csatornában, ha segítségre van szükséged vagy bejelentenél valamit.

> *(A szabályzat változtatásának jogát fenntartjuk!)*  
> *A szabályok nem ismerete nem mentesít a következmények alól.*
      `)
      .setFooter({ text: `Parancsot kérte: ${message.author.tag}` })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};
