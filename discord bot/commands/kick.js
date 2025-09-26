const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "kick",
    description: "Kidob egy felhasználót a szerverről.",
    async execute(message, args) {
        if (!message.guild) return;

        // Jogosultság ellenőrzése
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply("❌ Nincs jogosultságod tagokat kidobni!");
        }

        const member = message.mentions.members.first();
        if (!member) {
            return message.reply("Jelölj meg egy felhasználót, akit ki szeretnél dobni!");
        }

        if (!member.kickable) {
            return message.reply("❌ Nem tudom kidobni ezt a felhasználót (magasabb rangú lehet nálam).");
        }

        const reason = args.slice(1).join(" ") || "Nincs megadva indok";

        try {
            await member.kick(reason);

            const embed = new EmbedBuilder()
                .setTitle("🚪 Tag kidobva")
                .setColor("#042632")
                .addFields(
                    { name: "👤 Felhasználó", value: `${member.user.tag}`, inline: true },
                    { name: "👮 Kidobta", value: `${message.author.tag}`, inline: true },
                    { name: "📄 Indok", value: reason, inline: false }
                )
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error("Hiba a kick parancsnál:", err);
            message.reply("⚠️ Hiba történt a kidobás során!");
        }
    }
};
