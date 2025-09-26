const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "szavazas",
  description: "Igen/nem szavazás gombokkal",
  async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("❌ Ehhez a parancshoz admin jogosultság kell!");
    }
    if (!args.length) {
      return message.reply("Használat: .szavazas [kérdés]");
    }

    const question = args.join(" ");

    const embed = new EmbedBuilder()
      .setTitle("📊 Szavazás")
      .setDescription(`**${question}**`)
      .setColor("#042632")
      .setFooter({ text: `Szavazást indította: ${message.author.tag}` });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("vote_yes")
        .setLabel("✅ Igen")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("vote_no")
        .setLabel("❌ Nem")
        .setStyle(ButtonStyle.Danger)
    );

    const pollMessage = await message.channel.send({
      embeds: [embed],
      components: [row],
    });

    // Collector a szavazatokhoz
    const collector = pollMessage.createMessageComponentCollector({ time: 30000 }); // 30s

    const votes = {};

    collector.on("collect", async (interaction) => {
      // ha már szavazott, ne engedd újra
      if (votes[interaction.user.id]) {
        return interaction.reply({
          content: "❌ Már szavaztál, nem tudsz újra!",
          ephemeral: true,
        });
      }

      // első szavazat rögzítése
      if (interaction.customId === "vote_yes") {
        votes[interaction.user.id] = "Igen";
      } else if (interaction.customId === "vote_no") {
        votes[interaction.user.id] = "Nem";
      }

      await interaction.reply({
        content: `✅ Szavazatod rögzítve: ${votes[interaction.user.id]}`,
        ephemeral: true,
      });
    });

    collector.on("end", () => {
      const results = { Igen: 0, Nem: 0 };
      Object.values(votes).forEach((v) => results[v]++);

      const resultEmbed = new EmbedBuilder()
        .setTitle("📊 Szavazás végeredménye")
        .setDescription(
          `✅ Igen: **${results.Igen}**\n❌ Nem: **${results.Nem}**`
        )
        .setColor("Gold");

      message.channel.send({ embeds: [resultEmbed] });
    });
  },
};
