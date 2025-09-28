const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const messageDelete = require('../events/messageDelete');

module.exports = {
  name: 'partner',
  description: 'Kiírja egy partner szövegét.',
  async execute(message, args) {
    try {
      await message.delete();
      if (!message.guild) return;

      const query = args.join(' ').trim().toLowerCase();
      if (!query) return message.reply("Használat: `.partner <név>` vagy `.partner lista`");

      // PARTNER LISTA – bárki használhatja
      if (query === "lista" || query === "all") {
        const partnerChannels = new Map([
          ['dcwith', { name: "DCWITH", channelId: "1421160921937739786", messageId: "1421848311823863912"}], // channelID: 1414498372227694593 messageID: 1414644090108252261
          ['geri84vok', { name: "geri84vok", channelId: "1414027188952633444", messageId: "1414703667797430435" }],
          ['elitelands', { name: "EliteLands", channelId: "1414027188952633444", messageId: "1415230719977848874" }],
          ['oxix', { name: 'Oxix Clan', channelId: "1414027188952633444", messageId: "1415365804492329152" }],
          ['rangerbot', { name: 'RangerBot', channelId: "1414027188952633444", messageId: "1415536710674153602" }],
          ['magicstock', { name: 'Magic St0ck', channelId: "1414027188952633444", messageId: "1415536710674153603" }],
          ['gredark', { name: 'Gredark GANG Community', channelId: "1414027188952633444", messageId: "1415536710674153604" }],
          ['lazafejek', {name: 'lazafejek', channelId: "1421160921937739786", messageId: "1421852034457534686"}],
          ['tradecentral', {name: '༻ [ Trade Central ™ ] ༺', channelId: "1421160921937739786", messageId:"1421852137134100482"}],
          ['arettegesuralma', {name: 'MC】 ArettegesUralma', channelId: "1421160921937739786", messageId: "1421852201029992529"}]
        ]);

        const lines = [...partnerChannels.values()].map(
          (p, i) => `**${i + 1}.** [${p.name}](https://discord.com/channels/${message.guild.id}/${p.channelId}/${p.messageId})`
        );

        const embed = new EmbedBuilder()
          .setTitle("📋 Partner lista")
          .setColor("#042632")
          .setDescription(`Összesen **${partnerChannels.size}** partner található:\n\n${lines.join("\n")}`)
          .setTimestamp();

        return message.channel.send({ embeds: [embed] });
      }

      // PARTNER RÉSZLETEK – csak adminok
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply('❌ Ehhez a parancshoz admin jogosultság szükséges!');
      }

      const partners = new Map([
        ['dcwith', { name: "DCWITH", description: "Üdv Leendő DCWITH! 👋", text: ["Ha ezt az üzenetet valaha látod... Gondolkozz okosan! Ugyanis, ez lesz életed legjobb döntése!", "Remek vezetőségünk, saját kémhálózatunk, aktív staff csapat látja el a szervert!", "Mivel számunkra a te igényeid a legfontosabbak!", "", "Mit kínálunk❓", "Nitro Giveaway 🎁", "Partner lehetőség 🤝", "Aktív chat 💬", "Enyhe szabályozás 📜", "", "DCWITH Belépés ✅", "Megfogott az ajánlat? Remélem! Ugyanis, nálunk a DCWITH Ally-ban végtelen lehetőség van a karrier felé!", "Népszerű vagy? Talán kiközösített? Nem érdekel honnan jöttél, itt van helyed!", "Jelentkezhetsz: kémnek, DCWITH-nek, partner managernek, dekorálhatod ötleteiddel a szervert!", "", "Csatlakozz!", "Vanity: https://discord.gg/dcwithally", "Ping: @everyone"], invite: "https://discord.gg/6f2u5samj2" }],
        ['geri84vok', { name: "geri84vok", description: "🤝 Partner szöveg – geri84vok Community", text: ["A geri84vok Community egy barátságos és aktív közösség, ahol mindenki megtalálja a helyét! 🎉", "Nálunk átlátható rendszert találsz:", "", "📜 szabályzat – A közösség rendjét itt ismerheted meg.", "📢 hírek – Fontos közlemények és friss infók.", "👋 üdv – Ide várjuk az új tagok bemutatkozását.", "🧑‍🤝‍🧑 staff-lista – Ismerd meg a csapatot, aki segít neked.", "", "💬 chat – Szabad beszélgetés a tagokkal.", "🤖 bot-commands – Használható parancsok a botokhoz.", "🎥 videók – Oszd meg kedvenc tartalmaidat, vagy nézd meg másokét!", "", "🔊 Voice csatornák (Vc1–Vc4) – Hangos beszélgetéshez és közös játékhoz.", "", "Ha egy aktív, jókedvű közösséget keresel, ahol van helye a beszélgetésnek, a játékoknak és a szórakozásnak, akkor nálunk jó helyen vagy! 🚀", "Csatlakozz hozzánk, és légy része a geri84vok Community családnak! 💙", "Ping: @everyone"], invite: "https://discord.gg/5hGHWrKWcK" }],
        ['elitelands', { name: "EliteLands", description: "🔥 ELITELANDS – MAGYARORSZÁG LEGNAGYOBB MINECRAFT PROJEKTJE! 🔥", text: ["Unod a copy–paste szerókat? Itt az idő, hogy belépj egy teljesen új szintre!", "Az EliteLands nem csak egy szerver – ez a hely, ahol a közösség, a harc és az egyedi fejlesztések összeolvadnak.", "\n", "⚔️ KitPvP & FullPvP – küzdj a legkeményebbekkel, és mutasd meg, ki az aréna királya!", "🌍 Skyblock & MMO Oneblock – építsd meg a saját birodalmad, fejlődj, és éld át a túlélés minden pillanatát!", "🗡️ HCF / KitMap – csak az igazi harcosoknak, akik bírják a pörgést!", "\n", "💎 Miért az EliteLands?", "✅ Magyarország legnagyobb és legkomolyabb projektje", "✅ Egyedi fejlesztések és rendszerek, amit máshol nem találsz", "✅ Aktív, pörgős közösség", "✅ Folyamatos eventek, nyeremények és kihívások", "\n", "🔥 Itt nem csak játszol, hanem részese leszel valami nagynak.", "👉 Csatlakozz most, és tapasztald meg a LEGENDÁS EliteLands élményt!", "Ping: @everyone"], invite: "https://discord.gg/T8HRrsNSmB" }],
        ['oxix', { name: "Oxix Clan", description: "━━━━━━━━━━━━━━━━━━━", text: ["・Csatlakoznál egy profi és baráti Fortnite közösséghez, ahol a clán élet és a versenyek várnak rád? 🎮", "\n", "・Amit nyújtunk a tagoknak: ✅", "\n", "Tippek, stratégiák pro játékosoktól :👑", "\n", "Baráti és segítőkész staff csapat :👨🏻", "\n", "Közösségi események, mini tornák ⭐", "\n", "Nosztalgiázás régi szezonokkal :📽️", "\n", "Discord aktivitás és jó hangulat :🔥", "\n", "\n", "Csatlakoznál a clánhoz?", "Üdvözlettel: Oxix Clan┃🇭🇺", "Gyere játszani velünk┃🎮", "\n", "\n", "\n", "\n", "Ping:@everyone",], invite: "http://dsc.gg/oxixclan" }],
        ['rangerbot', { name: "RangerBot", description: "**Szeretnél egy teljesen Magyar, folyamatosan fejlődő, megbízható Discord botot a szerveredre?** \n*Itt a megoldás, használd a **RangerBot**-ot!*", text: ["A Bot jelenleg több, mint **235 parancs**ot tartalmaz, illetve több, mint **440 szerver**en van bent.", "Magyarországon a RangerBot tartalmazta először a GlobalChat rendszert, mely már több, mint 120 szerveren elérhető.", "A Magyar Discord botok közül a RangerBotnak a legfejlettebb az Economy rendszere, illetve nálunk találod a legmodernebb Weboldalt is.", "\n", "Továbbá nem utolsó sorban van egy remek Staff csapatunk, akik mindent megtesznek a közösség érdekeit szolgálva,", "Folyamatos Partnerségi, illetve Tagfelvételi lehetőséget kínálunk, többek között Fejlesztő pozícióba is.", "A Support szerveünk, illetve a GlobalChat kiemelkedően aktív, tehát már a közösség miatt is érdemes lehet belépni.", "\n", "Ha a leírtak alapján megtetszett a Bot, és szeretnéd megnézni a teljes parancs- és rendszerlistát, írd be a következő parancsot: r!help", "\n", "**Weboldal:** <https://rangerbot.hu>", "**Support Szerver:** https://discord.gg/cgKcscUz3A", "**Bot Invite:** <https://discord.hu/invite>", "", "*A fent leírt adatok 2022. 12. 12-éről származnak.*", "\n", "||@everyone||"], invite: "https://discord.gg/cgKcscUz3A" }],
        ['lazafejek', {name: "lazafejek", description: "**pacek szero**", text: ["napi beefek, lazitasok, gamek, stb rengeteg giveaway \n kulon egyeni rangok \n partnerseg (barmilyen taguval) \n most is aktiv dekoracio sorsolas van. \n Ping: @everyone"], invite: "https://discord.gg/9CRbTbG5M8" }],
        ['tradecentral', {name: "༻ [ Trade Central ™ ] ༺", description: "**#1 CHEAP INGAME MARKET**", text: ["**Tired of overpaying for ingame items?** \n Stop wasting money, start buying cheap ingame items only at **Trade Central™** 🔥 \n \n **⭑───────────────⭑** \n 🎮 **Our Market Includes:**  \n 🎲 Robux \n 👤 Roblox Accounts \n 💎 Roblox Limiteds \n 🎯 V-Bucks \n ⚡ Fortnite Accounts \n 🎟 Valorant Points  \n 🤝 Riot Buddy \n 🔫 Apex Coins \n 💵 GTA V Cash \n **⭑───────────────⭑** \n \n ✨ **Why Buy From Us?** \n ✔️ Cheapest ingame items, \n ✔️ Insanely fast delivery, (minutes, not hours!) \n ✔️ 100% safe & secure, \n ✔️ Active staff & vouch system, \n ✔️ Trusted by 100's of buyers daily! \n **━━━━━━━━━━━━━━━** \n \n 🚀 **Join the #1 market for insane deals today!** \n Ping: @everyone @here Invite: "], invite: "https://discord.gg/b9fQq76ED4"}],
        ['arettegesuralma', {name: "【MC】 ArettegesUralma", description: "Üdvözlünk a szerveren! A szervert _Starcream_ alapította 2022.08.5-én. A szerver első játékosa Gordi volt majd xXValentin1Xx és később pro is csatlakozott. A szerver mára már több mint 100 játékossal gazdagodott!", text: [" **Szeretnél egy, szabályok nélküli Minecraft szerverben részt venni?** \n Akkor a **ArettegesUralma** szervere éppen rád vár! 🤪 \n Van saját Kingdoms szerverünk is.  Neve: **RettegesKingdoms**.⚔️  \n \n A szerver verzióját és Ip címét  megtaláljátok a Discord szerveren.  \n Már 2022 óta fut és működik a szerver! (Az 'anarhia.') 🏃‍♂️ \n Kingdoms szerverünk 2025 óta fut.⚔️ \n \n **Figyelem!** A Spawn területről kijutni segítség vagy csalás nélkül szinte lehetetlen ugyan is sokan föladják az első 10 percben a játékot. (Anarhiára vonatkozik.) \n \n \n **Szerveren található:**  \n  ➡️  Partner szerzési lehetőség. 🤝 \n  ➡️ Rendszeres ajándéksorsolások (Giveaway)! 🎁 \n  ➡️Minden fontos döntést közösen szavazunk meg.🗳️ \n  ➡️ Már a harmadik generáció van a szerverünkön! (Anarhia) 🧓 \n  ➡️ **Free textúra pack csomagok a szerveren.** 🤩 \n  ➡️ Aktív és összetartó közössége van. \n  ➡️ Heti LvL toplista, ha te  is szeretnél rajta lenni! 🔝 \n  ➡️ Eredeti Minectaft és crackelt Minecraft-tal is csatlakozhattok! 🍘 \n \n Csatlakozzatok Discord szerverünkhöz: \n \n Ping: @everyone"], invite: "https://discord.gg/nkAfR6jG8W"}],
        ['magicstock', {
          name: "Magic StOck",
          description: null,
          text: [
            "🌍 **Magic St0ck ⚡**",
            "🇭🇺 **Mit kínálunk neked?**",
            "───────────────────────",
            "> 🪙 `Olcsó Discord Nitro & Boost`",
            "> 🧑‍🤝‍🧑 `Valódi, aktív Discord tagok`",
            "> 🎉 `Nyereményjátékok, eventek`",
            "> 🤝 `Partnerségi lehetőségek`",
            "> 💳 `Gyors és biztonságos vásárlás`",
            "> 🎁 `Aktív tagoknak jutalmak`",
            "",
            "🛒 **Webshop:** https://maagicshop.mysellauth.com/",
            "🔗 **Link:** https://discord.gg/pNdGYmk5tG",
            "",
            "🌍 **Magic St0ck ⚡**",
            "🇬🇧 **What do we offer?**",
            "───────────────────────",
            "> 🪙 `Cheap Discord Nitro & Boosts`",
            "> 🧑‍🤝‍🧑 `Real and active Discord members`",
            "> 🎉 `Exciting giveaways & events`",
            "> 🤝 `Open for partnerships`",
            "> 💳 `Fast & secure checkout`",
            "> 🎁 `Rewards for active members`",
            "",
            "🛒 **Webshop:** https://maagicshop.mysellauth.com/",
            "🔗 **Link:** https://discord.gg/pNdGYmk5tG",
            "@everyone"
          ],
          invite: "https://discord.gg/pNdGYmk5tG"
        }],
        ['gredark', {
          name: "Gredark GANG Community", description: "", text: [
            "A gredark community meg èrkezett",
            "Rendes szerver",
            "\n",
            "Jól ki van dolgozva minden is",
            "\n",
            "Jól ki van dolgozva minden is",
            "\n",
            "Van ott minden is",
            "\n",
            "Több mint 200 an vannak a placcon",
            "\n",
            "Nagy lètszámú aktív gredark community",
            "\n",
            "Join now",
            "\n"
          ], invite: "https://discord.gg/ACK9USCsXW"
        }]
      ]);

      let partner = partners.get(query);
      if (!partner) partner = [...partners.values()].find(p => p.name && p.name.toLowerCase() === query);
      if (!partner) return message.channel.send("Nincs ilyen partner a listában!");

      const embed = new EmbedBuilder()
        .setTitle(`🤝 Partner: ${partner.name}`)
        .setColor("#042632")
        .setTimestamp();

      const fullText = partner.text.join('\n');
      const MAX_DESC = 4096;
      const MAX_FIELD = 1024;

      if (fullText.length <= MAX_DESC) {
        embed.setDescription((partner.description ? partner.description + '\n\n' : '') + fullText);
      } else {
        embed.setDescription(partner.description || 'Részletek alább:');
        let start = 0;
        let partIndex = 1;
        while (start < fullText.length) {
          const chunk = fullText.slice(start, start + MAX_FIELD);
          embed.addFields({ name: `Rész ${partIndex}`, value: chunk || '\u200b' });
          start += MAX_FIELD;
          partIndex++;
        }
      }

      if (partner.invite) {
        embed.addFields({ name: "🔗 Link:", value: partner.invite });
      }

      if (partner.name === "Magic StOck") {
        // Csak szöveges verzió Magic St0ck-hoz
        return message.channel.send(partner.text.join("\n"));
      }

      // Minden más partnernél embed
      await message.channel.send({ embeds: [embed] });

    } catch (err) {
      console.error("[ERROR] partner parancs hiba:", err);
      await message.reply("Hiba történt a parancs végrehajtása közben. Nézd meg a konzolt (log).");
    }
  }
};