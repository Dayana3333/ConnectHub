// setupMutedRole.js
module.exports = {
    name: 'guildCreate', // amikor a bot belép egy szerverre
    async execute(guild) {
        let mutedRole = guild.roles.cache.find(r => r.name === "Muted");

        if (!mutedRole) {
            try {
                console.log(`[INFO] Nincs "Muted" role a ${guild.name} szerveren. Létrehozás...`);

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
                    }).catch(err => console.error(`[ERROR] Nem sikerült beállítani a jogosultságokat:`, err));
                }

                console.log(`[INFO] Muted role létrehozva és beállítva a ${guild.name} szerveren.`);
            } catch (err) {
                console.error(`[ERROR] Nem tudtam létrehozni a Muted rangot a ${guild.name} szerveren:`, err);
            }
        } else {
            console.log(`[INFO] Már létezik Muted role a ${guild.name} szerveren.`);
        }
    }
};