const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'adminhelp',
  description: 'Admin parancsokhoz.',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor('#042632')
      .setTitle('👋 Üdvözöllek a parancsok között!')
    .setDescription(
    `📩 **.embed**\n– Küld egy alapértelmezett beágyazott üzenetet.\n` +
    `💬 **.say <szöveg>**\n– Kiíratja a megadott szöveget a bottal.\n` +
    `✏️ **.nick <felhasználóID> <új név / clear>**\n– Becenév módosítása vagy törlése.\n` +
    `🔨 **.ban <felhasználóID> [indok]**\n– Felhasználó kitiltása.\n` +
    `🚪 **.kick <felhasználóID> [indok]**\n– Felhasználó kidobása a szerverről.\n` +
    `🧹 **.clear <szám>**\n– Megadott számú üzenet törlése a csatornából.\n` +
    `🤝 **.partner <név>**\n– Kiírja a partner szerver szövegét.\n` +
    `📊 **.szavazas <kérdés>**\n– Igen/Nem szavazás gombokkal.\n` +
    `⚡ **.gyszav <kérdés>**\n– Gyors szavazás reakciójelekkel.\n` +
    `♻️ **.unban <felhasználóID>**\n– Kitiltott felhasználó visszaengedése.\n` +
    `ℹ️ **.help**\n– Kiírja az elérhető parancsokat.\n` +
    `🤝 **.partner lista**\n– Kiírja a jelenlegi partnereinket.\n` +
    `🔇 **.mute <felhasználó> <idő> <indok>(opcionális)**\n– Némítja a felhasználót a megadott időtartamra.\n` +
    `📖 **.szab**\n– Szerver szabályzat kíirása. / .rules – Displays the server rules.\n` +
    `📨 **.dm <felhasználó> <üzenet>**\n– A bottal küldhetsz üzenetet privátba a megemlített felhasználónak.\n` +
    `🤖 **.join log <#csatorna>**\n– Beállíthatod, hogy melyik csatornába logoljon ha valaki belép a szerverre.\n` +
    `📥 **.log set (normal)/(mute) #csatorna**\n– Beállíthatod, hogy melyik csatornába logoljon normálon és külön ha valaki némítást kap.\n` +
    `👥 **.backup**\n– Jelenlegi szervered mentése / .backup load <backupId>\n` +
    `🌀 **.reakcio <emoji> <@rang> <emoji> <@rang>**\n– Választható rangok.\n` +
    `🗣 **.unmute <felhasználó> <indok>(opcionális)**\n– Feloldja a némítás alatt lévő felhasználót.\n\n` +
    `*+ A botban található egy **spam gátló rendszer** is.*\n` +
    `*+ AntiRaid*`
    )
      .setFooter({ text: `Parancsot kérte: ${message.author.tag}` })
      .setAuthor({
        name: 'Készítő: regedit_404', // A bot fejlesztője
        iconURL: 'https://media.discordapp.net/attachments/1410384904104972401/1412875523910012958/E8CAB3A7-8579-43C4-B02A-EDA91AC67894.png'
      })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  }
};
