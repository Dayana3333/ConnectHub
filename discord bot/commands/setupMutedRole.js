// setupMutedRole.js
module.exports = {
    name: 'guildCreate', // amikor a bot belép egy szerverre
    async execute(guild) {
        let mutedRole = guild.roles.cache.find(r => r.name === "Muted");

        // Find a text channel to send feedback
        const textChannel = guild.channels.cache.find(
            ch => ch.type === 0 && ch.permissionsFor(guild.members.me).has('SendMessages')
        ); // 0 = GuildText in Discord.js v14+

        if (!mutedRole) {
            try {
                 // console.log(`[INFO] Nincs "Muted" role a ${guild.name} szerveren. Létrehozás...`);
                if (textChannel)
                    await textChannel.send(`[INFO] Nincs "Muted" role a ${guild.name} szerveren. Létrehozás...`);

                // Létrehozzuk a Muted rangot
                mutedRole = await guild.roles.create({
                    name: "Muted",
                    color: "#555555",
                    reason: "Spam védelemhez szükséges"
                });

                // Jogosultságok beállítása minden csatornára
                for (const [channelId, channel] of guild.channels.cache) {
                    await channel.permissionOverwrites.edit(mutedRole, {
                        SendMessages: false,
                        AddReactions: false,
                        Speak: false,
                        Connect: false
                    }).catch(async err => {
                        // console.error(`[ERROR] Nem sikerült beállítani a jogosultságokat:`, err);
                        if (textChannel) await textChannel.send(`[ERROR] Nem sikerült beállítani a jogosultságokat a csatornán: ${channel.name}`);
                    });
                }

                // console.log(`[INFO] Muted role létrehozva és beállítva a ${guild.name} szerveren.`);
                if (textChannel)
                    await textChannel.send(`[INFO] Muted role létrehozva és beállítva a ${guild.name} szerveren.`);

            } catch (err) {
                // console.error(`[ERROR] Nem tudtam létrehozni a Muted rangot a ${guild.name} szerveren:`, err);
                if (textChannel)
                    await textChannel.send(`[ERROR] Nem tudtam létrehozni a Muted rangot a ${guild.name} szerveren.`);
            }

        } else {
            // console.log(`[INFO] Már létezik Muted role a ${guild.name} szerveren.`);
            if (textChannel)
                await textChannel.send(`[INFO] Már létezik Muted role a ${guild.name} szerveren.`);
        }
    }
};