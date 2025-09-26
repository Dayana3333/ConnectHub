module.exports = {
  name: "messageReactionAdd",
  async execute(reaction, user) {
    if (user.bot) return;

    if (reaction.partial) await reaction.fetch();

    // reactionrole logika ide jön
  }
};
