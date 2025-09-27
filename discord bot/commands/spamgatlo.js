const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const { punishments } = require('./mybot_project/utils/spamData.js');

module.exports = (bot) => {
    bot.on("messageCreate", async (message) => {
        if (!message.guild || message.author.bot) return;

        const member = message.member;

        // Adminokra / moderátorokra NE legyen érvényes
        if (
            member.permissions.has(PermissionsBitField.Flags.Administrator) ||
            member.permissions.has(PermissionsBitField.Flags.ModerateMembers)
        ) {
            return;
        }

        const userId = message.author.id;
        const now = Date.now();

        // cooldown Map-et valahol létre kell hozni és exportálni
        if (!global.cooldown) global.cooldown = new Map();
        const cooldown = global.cooldown;

        if (!cooldown.has(userId)) cooldown.set(userId, []);
        let timestamps = cooldown.get(userId);

        timestamps = timestamps.filter(ts => now - ts < 2000);
        timestamps.push(now);
        cooldown.set(userId, timestamps);

        if (timestamps.length >= 2) {
            let strikes = punishments.get(userId) || 0;
            strikes++;
            punishments.set(userId, strikes);

            try {
                await message.delete();
            } catch (err) {
                console.error("[ERROR] Nem sikerült törölni az üzenetet:", err);
            }

            const mutedRole = message.guild.roles.cache.find(r => r.name === "Muted");
            if (!mutedRole) return;

            async function sendDM(user, text) {
                try { await user.send(text); } catch {}
            }

            // === SZANKCIÓK ===
            if (strikes <= 5) {
                await message.channel.send(`${message.author}, ne spammelj! ⛔ (${strikes}/5 figyelmeztetés)`);
                await sendDM(message.author, `⚠️ Figyelmeztetés ${strikes}/5: Ne spammelj a(z) ${message.guild.name} szerveren!`);

            } else if (strikes === 6) {
                await member.roles.add(mutedRole, "Spam - 5 perces mute");
                await message.channel.send(`${message.author} 5 percre lenémítva. 🔇`);
                await sendDM(message.author, `🔇 5 percre némítva lettél spamelés miatt a(z) ${message.guild.name} szerveren.`);

                setTimeout(() => {
                    if (member.roles.cache.has(mutedRole.id)) {
                        member.roles.remove(mutedRole, "5 perces mute lejárt");
                        sendDM(message.author, `✅ Lejárt az 5 perces némításod a(z) ${message.guild.name} szerveren.`);
                    }
                }, 5 * 60 * 1000);

            } else if (strikes === 7) {
                // utolsó lehetőség, csak DM
                await sendDM(
                  message.author,
                  `⚠️ Utolsó lehetőség! Még egyszer spammelsz, felfüggesztve leszel a(z) ${message.guild.name} szerveren.`
                );

            } else if (strikes >= 8) {
                // felfüggesztés (itt választhatsz kicket vagy bant)
                try {
                    await member.kick("Spam – 8. figyelmeztetés, felfüggesztés");
                    await message.channel.send(`${message.author.tag} felfüggesztve (kivágva a szerverről) a spamelés miatt. 🚫`);
                    await sendDM(message.author, `🚫 Felfüggesztve lettél a(z) ${message.guild.name} szerverről spamelés miatt.`);
                } catch (err) {
                    console.error("Nem sikerült felfüggeszteni (kick/ban):", err);
                }
            }
        }
    });
};
