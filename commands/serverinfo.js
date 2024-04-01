const mcs = require('node-mcstatus');
const dotenv = require('dotenv');
dotenv.config();
const Query = require("minecraft-query")

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
    color: 0x9013FE,
    title: 'EMMYBUNNMC SERVER',
    fields: [],
    timestamp: new Date().toISOString()
  },
  process: () => {
    return new Promise((resolve, reject) => {
      console.log("sjdhflsakjfdhlaskudfjhasdf")
      console.log(mcServerIP)
      console.log(mcQueryPort)
      mcs.statusJava(mcServerHostname, mcQueryPort, { query: true })
        .then((result) => {
            console.log('then')            
            resolve(result)
        })
        .catch((error) => {
            console.log('catch')
            reject(error)
        })
    })
  },
  SlashCommand: {
    options: [],
    run: async (client, interaction) => {
      const that = module.exports;

      that.embeddedMessage.fields = []
      that.process().then((responseField) => {
        let message = '';
        console.log(responseField)

        message += `*Hostname*: ${responseField.host}\n`
        message += `*Status*: ${(responseField.online) ? 'Online' : 'Offline'}`
        message += `\n*MC Version*: ${responseField.version.name_raw}`
        message += `\n*Modloader*: ${mcModloader}`
        message += `\n*Players:* ${responseField.players.online}`

        that.embeddedMessage.fields.push({name: 'Server info', value: message})
        return interaction.reply({embeds: [that.embeddedMessage]})
      })
    }
  }
}