const badWords = require('./badwords.js');

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")                // ékezetek eltávolítása
    .replace(/[\u0300-\u036f]/g, "") // ékezetek törlése
    .replace(/[^a-z0-9]/g, "");      // minden nem betű/szám törlése
}
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
    .replace(/[^a-z0-9]/g, ""); // minden speciális karaktert kidob
}

// minden rossz szóból regex
const badRegexes = badWords.map(word => {
  const pattern = word
    .toLowerCase()
    .split("")
    .map(ch => ch + "+") // minden betűből: pl. f+ a+ s+ z+
    .join("");
  return new RegExp(pattern, "i"); // kis/nagybetű mindegy
});


module.exports = {
  name: 'watch',
  run(client) {
    client.on('messageCreate', async (message) => {
      if (message.author.bot) return;

      const lowerMsg = message.content.toLowerCase();

      if (badWords.some(word => lowerMsg.includes(word))) {
        try {
          await message.delete();
          await message.channel.send(`${message.author}, kérlek ne használj csúnya szavakat! 🚫`);
        } catch (err) {
          console.error('Nem tudtam törölni az üzenetet:', err);
        }
      }
    });
  }
};
