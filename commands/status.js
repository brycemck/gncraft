const mcUtil = require('minecraft-server-util');
const dotenv = require('dotenv');
dotenv.config();

const mcServerIP = process.env.MC_SERVER_IP;
const mcServerHostname = process.env.MC_SERVER_HOSTNAME;
const mcQueryPort = process.env.MC_QUERY_PORT;

module.exports = {
  name: 'status',
  description: 'Queries the Minecraft server to see status and active players.',
  usage: '',
  embeddedMessage: {
    color: 0x0099FF,
    title: 'GaynadianCraft',
    fields: [],
    timestamp: new Date().toISOString()
  },
  process: () => {
    return new Promise((resolve, reject) => {
      mcUtil.status(mcServerIP, parseInt(mcQueryPort))
        .then((result) => {
          resolve(result)
        })
        .catch((error) => {
          reject(error)
        });
    })
  },
  SlashCommand: {
    options: [],
    run: async (client, interaction) => {
      const that = module.exports;

      that.process().then((responseField) => {
        let messageReply = '';
        that.embeddedMessage.fields = []
        
        messageReply += `\nOnline Players: ${responseField.players.online}`;
        if (responseField.players.online > 0) messageReply += ` (${responseField.players.sample.map(player => player.name).join(', ')})`
        messageReply += `\nServer Version: ${responseField.version.name}`;
        messageReply += `\nRound Trip Latency: ${responseField.roundTripLatency}`;

        that.embeddedMessage.fields.push({name: 'Server status', value: messageReply})
        return interaction.reply({embeds: [that.embeddedMessage]})
      })
    }
  }
}