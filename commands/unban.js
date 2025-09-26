const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unban',
    description: 'Feloldja egy kitiltott felhasználó kitiltását.',
    async execute(message, args, bot) {
        if (!message.guild) return; // Csak szerveren működik
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("Nincs jogosultságod feloldani a kitiltásokat!");
        }

        const rawId = args[0];
        if (!rawId) {
            return message.reply("Adj meg egy felhasználó ID-t vagy említést!");
        }

        // Ha mentiont írtak, kiszedjük belőle a számot/ID-t
        const userId = rawId.replace(/[<@!>]/g, '');

        try {
            // Lekérjük a bannolt felhasználót
            const banInfo = await message.guild.bans.fetch(userId);

            if (!banInfo) {
                return message.reply("Ez a felhasználó nincs kitiltva!");
            }

            // Unban
            await message.guild.members.unban(userId);

            const embed = new EmbedBuilder()
                .setTitle('Felhasználó kitiltása feloldva')
                .setColor('Green')
                .addFields(
                    { name: 'Felhasználó', value: `${banInfo.user.tag}`, inline: true },
                    { name: 'Feloldotta', value: `${message.author.tag}`, inline: true }
                )
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error('Hiba az .unban parancsnál:', err);
            message.reply('Hiba történt a kitiltás feloldása során. Ellenőrizd, hogy helyes-e az ID vagy említés.');
        }
    }
};
