const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Segítség a parancsokhoz.',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor('#042632')
      .setTitle('👋 Üdvözöllek a parancsok között!')
      .setDescription(
        `📩 **.embed** – Küld egy alapértelmezett beágyazott üzenetet.\n` +
        `💬 **.say <szöveg>** – Kiíratja a megadott szöveget a bottal.\n` +
        `✏️ **.nick <felhasználóID>** <új név / clear>** – Becenév módosítása vagy törlése.\n` +
        `🔨 **.ban <felhasználóID>** [indok]** – Felhasználó kitiltása.\n` +
        `🚪 **.kick <felhasználóID>** [indok]** – Felhasználó kidobása a szerverről.\n` +
        `🧹 **.clear <szám>** – Megadott számú üzenet törlése a csatornából.\n` +
        `🤝 **.partner <név>** – Kiírja a partner szerver szövegét.\n` +
        `📊 **.szavazas <kérdés>** – Igen/Nem szavazás gombokkal.\n` +
        `⚡ **.gyszav <kérdés>** – Gyors szavazás reakciójelekkel.\n` +
        `♻️ **.unban <felhasználóID>** – Kitiltott felhasználó visszaengedése.\n` +
        `ℹ️ **.help** – Kiírja az elérhető parancsokat.\n` +
        `🤝 **.partner lista** Kiírja a jelenlegi partnereinket.\n` +
        `🔇 **.mute <felhasználó> <idő> <indok>(opcionális)** Némítja a felhasználót a megadott időtartamra.\n` +
        `📖 **.szab** Szerver szabályzat kíirása./.rules Displays the server rules.\n` +
        `📨 **.dm <felhasználó> <üzenet>** A bottal küldhetsz üzenetet privátba (Direct Message) a megemlített felhasználónak.\n` +
        `🤖 **.join log <#csatorna>** Beállíthatod, hogy melyik csatornába logoljon ha valaki belép a szerverre.\n` +
        `📥 **.log set (normal)/(mute) #csatorna** Beállíthatod, hogy melyik csatornába logoljon normálon és külön ha valaki némítást kap.\n` +
        `👥 **.backup** Jelenlegi szervered mentése/ .backup load <backupId> \n` +
        `🌀 **.reakcio <emoji> <@rang> <emoji> <@rang>** Választható rangok. \n` +
        /*`**.start** Bot elinditása.\n` +
        `**.reload** Bot újrainditása.\n` +
        `**.stop** Bot leállitása. \n` +*/
        `🗣 **.unmute <felhasználó> <indok>(opcionális)** Feloldja a némítás alatt lévő felhasználót.\n\n` +
        `+ *A botban található egy **spam gátló rendszer** is*.` +
        `+ *AntiRaid*` 
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
