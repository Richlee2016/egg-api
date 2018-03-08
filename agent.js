module.exports = agent => {
    agent.messenger.on('egg-ready', () => {
        const data = { name: 'rich' };
        agent.messenger.sendToApp('rich', data);
    });
};