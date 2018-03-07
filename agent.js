module.exports = agent => {
    agent.messenger.on('egg-ready', () => {
        console.log(1);
        const data = { name: 'rich' };
        agent.messenger.sendToApp('rich', data);
    });
};