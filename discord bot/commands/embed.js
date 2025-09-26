const { EmbedBuilder, PermissionsBitField } = require('discord.js');

// Tároljuk, ki hányszor használta a parancsot adott napon
const usageCount = new Map();

module.exports = {
  name: 'embed',
  description: 'Embed üzenetet küld adminok számára.',
  async execute(message, args, bot) {
    const text = args.join(' ');
    if (!text) return message.reply('❌ Adj meg szöveget az embedhez!');

    const member = message.member;

    // Ha admin → nincs limit
    if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return sendEmbed(message, text);
    }

    // Nap alapú kulcs: userId + dátum
    const today = new Date().toISOString().split('T')[0];
    const key = `${message.author.id}-${today}`;

    let count = usageCount.get(key) || 0;

    if (count >= 5) {
      return message.reply('❌ Ma már elérted az 5 használati limitet ehhez a parancshoz.');
    }

    count++;
    usageCount.set(key, count);

    return sendEmbed(message, text);
  }
};
//const emoji = '<:newconnectlogo:1415561943191654491>';
// Külön függvény az embed küldéshez
async function sendEmbed(message, text) {
  try {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${message.author.username} üzenete`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTitle(`<:newconnectlogo:1414494951294636102> - ConnectHub`) // Rövid cím
      .setDescription(text)      // Ide tesszük a teljes szöveget
      .setColor("#042632")
      .setTimestamp();

    // először küldje az embedet
    await message.channel.send({ embeds: [embed] });

    // csak utána törölje a parancs üzenetet
    await message.delete();
  } catch (error) {
    console.error('❌ Hiba történt az embed küldésekor:', error);
    await message.channel.send('❌ Nem sikerült elküldeni az embedet.');
  }
}
