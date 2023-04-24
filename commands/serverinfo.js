const mcUtil = require('minecraft-server-util');
const dotenv = require('dotenv');
dotenv.config();

const mcServerIP = process.env.MC_SERVER_IP;
const mcServerHostname = process.env.MC_SERVER_HOSTNAME;
const mcConnectionInfoChannel = process.env.DISCORD_CONNECTION_INFO_CHANNEL_ID;
const mcQueryPort = process.env.MC_QUERY_PORT;
const mcModloader = process.env.MODLOADER;

module.exports = {
  name: 'serverinfo',
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

      that.embeddedMessage.fields = []
      that.process().then((responseField) => {
        let message = '';

        message += `*Hostname*: ${mcServerHostname}`
        message += `\n*MC Version*: ${responseField.version.name}`
        message += `\n*Modloader*: ${mcModloader}`
        message += `\n*Players Online:* ${responseField.players.online}`
        if (responseField.players.online > 0) message += ` (${responseField.players.sample.map(player => player.name).join(', ')})`
        message += `\n\nSee <#${mcConnectionInfoChannel}> for instructions on connecting.`

        that.embeddedMessage.fields.push({name: 'Server info', value: message})
        return interaction.reply({embeds: [that.embeddedMessage]})
      })
    }
  }
}