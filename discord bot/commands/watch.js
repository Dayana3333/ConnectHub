const { words: badWords } = require('../badwords.json');

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/8/g, "b")
    .replace(/9/g, "g")
    .replace(/@/g, "a")
    .replace(/\$/g, "s")
    .replace(/vv/g, "w")
    .replace(/v/g, "u")
    .replace(/[^a-z0-9]/g, ""); // strip everything not alphanumeric
}

// minden rossz szóból regex (pl. f+ a+ s+ z+)
const badRegexes = badWords.map(word => {
  const pattern = normalize(word)
    .split("")
    .map(ch => ch + "+")
    .join("");
  return new RegExp(pattern, "i"); // i = case-insensitive
});

module.exports = {
  name: 'watch',
  run(client) {
    client.on('messageCreate', async (message) => {
      if (message.author.bot) return;

      const normalizedMsg = normalize(message.content);

      if (badRegexes.some(regex => regex.test(normalizedMsg))) {
        try {
          await message.delete();
          await message.channel.send(
            `${message.author}, kérlek ne használj csúnya szavakat! 🚫`
          );
        } catch (err) {
          console.error('Nem tudtam törölni az üzenetet:', err);
        }
      }
    });
  }
};
