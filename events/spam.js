const { PermissionsBitField, EmbedBuilder } = require("discord.js");
//const { cooldown, punishments } = require("../utils/spamData.js");
const { punishments } = require('../utils/spamData.js');


module.exports = (bot) => {
    bot.on("messageCreate", async (message) => {
        if (!message.guild || message.author.bot) return;

        const member = message.member;

        // Adminokra / moderátorokra NE legyen érvényes
        if (
            member.permissions.has("Administrator") ||
            member.permissions.has("ModerateMembers")
        ) {
            return;
        }

        const userId = message.author.id;
        const now = Date.now();

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
                await sendDM(message.author, "🔇 5 percre némítva lettél spamelés miatt.");

                setTimeout(() => {
                    if (member.roles.cache.has(mutedRole.id)) {
                        member.roles.remove(mutedRole, "5 perces mute lejárt");
                        sendDM(message.author, "✅ Lejárt az 5 perces némításod.");
                    }
                }, 5 * 60 * 1000);
            }

            // (a többi szankció marad ugyanígy…)
        }
    });
};
