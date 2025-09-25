const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unmute',
    description: 'Feloldja a némítást',
    async execute(message, args) {
        // Jogosultság ellenőrzése
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return message.reply('❌ Nincs jogosultságod!');

        // Felhasználó kiválasztása
        const member = message.mentions.members.first();
        if (!member) return message.reply('❌ Jelölj ki egy felhasználót!');

        // Muted szerep
        const mutedRole = message.guild.roles.cache.find(r => r.name === 'Muted');
        if (!mutedRole) return message.reply('❌ Nincs "Muted" rang a szerveren!');

        // Ellenőrzés, hogy a felhasználó tényleg némítva van-e
        if (!member.roles.cache.has(mutedRole.id)) 
            return message.reply('❌ A felhasználó nincs némítva!');

        // Indok összefűzése (opcionális)
        const reason = args.slice(1).join(' ') || 'Nincs megadva';

        // Némítés feloldása
        await member.roles.remove(mutedRole, `Unmute: ${reason}`);

        // Embed létrehozása
        const unmuteEmbed = new EmbedBuilder()
            .setTitle('🔊 Felhasználó némítása feloldva')
            .setColor('Green')
            .addFields(
                { name: 'Felhasználó', value: `${member}`, inline: true },
                { name: 'Moderátor', value: `${message.author}`, inline: true },
                { name: 'Indok', value: reason, inline: false }
            )
            .setTimestamp();

        // Küldés embed + ping
        await message.channel.send({
            embeds: [unmuteEmbed],
            allowedMentions: { users: [member.id, message.author.id] }
        });
    }
};
