const mcs = require('node-mcstatus');
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
      // mcUtil.status(mcServerIP, parseInt(mcQueryPort))
      //   .then((result) => {
      //     console.log('then')
      //     resolve(result)
      //   })
      //   .catch((error) => {
      //     console.log('catch')
      //     reject(error)
      //   });
      // The `port` argument is optional and defaults
      // to 25565. The `options` argument is optional.
      mcs.statusJava(mcServerIP, mcQueryPort, { query: true })
        .then((result) => {
            // `result` will be the same shape and
            // properties as what is documented on
            // our website.
            // https://mcstatus.io/docs#java-status
            console.log('then')
            resolve(result)
        })
        .catch((error) => {
            // If the server is offline, then
            // you will NOT receive an error here.
            // Instead, you will use the `result.online`
            // boolean values in `.then()`.
            // Receiving an error here means that there
            // was an error with the service itself.
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
        let message = 'test';
        console.log(responseField)

        // message += `*Hostname*: ${mcServerHostname}`
        // message += `\n*MC Version*: ${responseField.version.name}`
        // message += `\n*Modloader*: ${mcModloader}`
        // message += `\n*Players Online:* ${responseField.players.online}`
        // if (responseField.players.online > 0) message += ` (${responseField.players.sample.map(player => player.name).join(', ')})`
        // message += `\n\nSee <#${mcConnectionInfoChannel}> for instructions on connecting.`

        that.embeddedMessage.fields.push({name: 'Server info', value: message})
        return interaction.reply({embeds: [that.embeddedMessage]})
      })
    }
  }
}