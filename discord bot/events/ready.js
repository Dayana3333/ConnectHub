module.exports = {
  name: 'ready',
  once: true,
  execute(bot) {
    console.log(`✅ Bejelentkezve mint ${bot.user.tag}`);
         statusMessages = [
        { name: 'Status 1', type: 4 },
        { name: 'Status 2', type: 4 },
        { name: 'Status 3', type: 4 }
    ];
    bot.user.setPresence({
      activities: [
        { name: 'ConnectHub', type: 0 },
        { name: 'regedit_404 ⚒️ ', type: 2 },
      ],
      status: 'online',
    });
  },
};