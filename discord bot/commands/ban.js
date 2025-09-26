const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bannol egy felhasználót a szerverről.',
    async execute(message, args, bot) {
        if (!message.guild) return; // Csak szerveren működik
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("Nincs jogosultságod tagot bannolni!");
        }

        const user = message.mentions.members.first();
        if (!user) return message.reply("Jelölj meg egy felhasználót!");
        if (!user.bannable) return message.reply("Nem tudom bannolni ezt a felhasználót!");

        const reason = args.slice(1).join(' ') || "Nincs megadva indok";

        try {
            await user.ban({ reason });

            const embed = new EmbedBuilder()
                .setTitle('Felhasználó kitiltva')
                .setColor('Red')
                .addFields(
                    { name: 'Felhasználó', value: `${user.user.tag}`, inline: true },
                    { name: 'Bannolta', value: `${message.author.tag}`, inline: true },
                    { name: 'Indok', value: reason }
                )
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error('Hiba a .ban parancsnál:', err);
            message.reply('Hiba történt a bannolás során.');
        }
    }
};