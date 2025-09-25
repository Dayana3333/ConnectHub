const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "clear",
    description: "Törli a megadott számú üzenetet a csatornából (max 10 000).",
    async execute(message, args) {
        if (!message.guild) return;

        // 🔑 Engedélyezett role ID-k
        const allowedRoles = ["1414015847248167032", "1414016244746817647"]; 
        if (!message.member.roles.cache.some(role => allowedRoles.includes(role.id))) {
            return message.reply("❌ Nincs jogosultságod ehhez a parancshoz!");
        }

        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount <= 0) {
            return message.reply("Adj meg egy érvényes számot! Példa: `.clear 10`");
        }

        if (amount > 10000) {
            return message.reply("Egyszerre maximum **10 000** üzenetet törölhetsz!");
        }

        try {
            let deleted = 0;
            let toDelete = amount;

            while (toDelete > 0) {
                const deleteNow = Math.min(toDelete, 100); // max 100 egyszerre
                const deletedMessages = await message.channel.bulkDelete(deleteNow, true);

                if (deletedMessages.size === 0) {
                    // ⚠️ nincs több törölhető üzenet → álljunk le
                    break;
                }

                deleted += deletedMessages.size;
                toDelete -= deletedMessages.size;

                // Kis pihenő, hogy ne spamelje túl az API-t
                await new Promise(res => setTimeout(res, 500));
            }

            const embed = new EmbedBuilder()
                .setColor("#042632")
                .setTitle("🧹 Üzenetek törölve")
                .addFields(
                    { name: "Törölte", value: `${message.author.tag}`, inline: true },
                    { name: "Mennyiség", value: `${deleted}`, inline: true },
                    { name: "Csatorna", value: `${message.channel}`, inline: false }
                )
                .setTimestamp();

            const msg = await message.channel.send({ embeds: [embed] });
            setTimeout(() => msg.delete().catch(() => {}), 5000);
        } catch (err) {
            console.error("Hiba a clear parancsnál:", err);
            message.reply("⚠️ Hiba történt az üzenetek törlése közben!");
        }
    }
};
