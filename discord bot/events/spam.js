const { PermissionFlagsBits } = require("discord.js");
const { cooldown, punishments } = require("../utils/spamData.js");


module.exports.execute = (client) => {
    client.on("messageCreate", async (message) => {
        if (!message.guild || message.author.bot) return;

        const member = message.member;
        if (!member) return;

        // Adminokra / moderátorokra NE legyen érvényes
        if (
            member.permissions.has(PermissionFlagsBits.Administrator) ||
            member.permissions.has(PermissionFlagsBits.ModerateMembers)
        ) {
            return;
        }

        const userId = message.author.id;
        const now = Date.now();

        if (!cooldown.has(userId)) cooldown.set(userId, []);
        let timestamps = cooldown.get(userId);

        // csak az elmúlt 3 másodpercet nézze
        timestamps = timestamps.filter(ts => now - ts < 3000);
        timestamps.push(now);
        cooldown.set(userId, timestamps);

        // ha 4-nél több üzenet van az előző 3 másodpercben 
        if (timestamps.length >= 4) {
            let strikes = punishments.get(userId) || 0;
            strikes++;
            punishments.set(userId, strikes);

            try {
                await message.delete();
            } catch (err) {
                await message.channel.send(`Nem sikerült törölni az üzenetet ${err.message}`)
            }

            const mutedRole = message.guild.roles.cache.find(r => r.name === "Muted");

            async function sendDM(user, text) {
                try { await user.send(text); } catch { }
            }

            if (strikes <= 5) {
                await message.channel.send(`${message.author}, ne spammelj! ⛔ (${strikes}/5 figyelmeztetés)`);
            } else if (strikes === 6) {
                if (mutedRole) {
                    try {
                        await member.roles.add(mutedRole, "Spam - 2 perces mute");
                        await message.channel.send(`${message.author} 2 percre lenémítva. 🔇`);
                    } catch (err) {
                        await message.channel.send(`Nem sikerült némítani: ${err.message}`)
                    }
                    setTimeout(async () => {
                        try {
                            const freshMember = await message.guild.members.fetch(member.id);
                            if (freshMember.roles.cache.has(mutedRole.id)) {
                                await freshMember.roles.remove(mutedRole, "2 perces mute lejárt");
                            }
                        } catch (err) {
                            await message.channel.send(`Nem sikerült levenni a némítást: ${err.message}`)
                        }
                    }, 2 * 60 * 1000);
                } else {
                    // Ha nincs muted role
                    await message.channel.send("Muted role nincs beállítva — nem tudtam némítani.");
                }
            }
        }
    });
};