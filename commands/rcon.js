const { EmbedBuilder, RoleSelectMenuBuilder } = require('discord.js');

const { Rcon } = require("rcon-client")
const dotenv = require('dotenv');
dotenv.config();

const mcServerIP = process.env.MC_SERVER_IP;
const mcRconPort = process.env.MC_RCON_PORT;
const mcRconPassword = process.env.MC_RCON_PASSWORD;

module.exports = {
  name: 'rcon',
  description: 'Runs a Minecraft console command on the server using RCON.',
  usage: '[command]',
  embeddedMessage: {
    color: 0x9013FE,
    title: 'EMMYBUNNMC SERVER',
    fields: [],
    timestamp: new Date().toISOString()
  },
  process: (command) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const rcon = await Rcon.connect({
            host: mcServerIP, port: mcRconPort, password: mcRconPassword
          })
          let responses = await Promise.all([
            rcon.send(command)
          ])
          rcon.end()
          resolve(responses[0])
        } catch(error) {
          reject(error);
        }      
      })();
    })
  },
  SlashCommand: {
    options: [
      {
        name: "command",
        value: "command",
        type: 3,
        description: "Enter a console command to execute on the server.",
      },
    ],
    run: async (client, interaction) => {
      const that = module.exports;
      that.embeddedMessage.fields = []
      if (interaction.member.roles.cache.has(process.env.DISCORD_MINECRAFTADMIN_ROLE_ID)) {
        if (interaction.options.getString('command')) {
          that.process(interaction.options.getString('command')).then((responseField) => {
            that.embeddedMessage.fields.push({name: 'RCON Response', value: responseField})
            return interaction.reply({embeds: [that.embeddedMessage]})
          })
        }
      } else {
        that.embeddedMessage.fields.push({name: 'You must be an admin to do this.', value: `Please tag <@&${process.env.DISCORD_MINECRAFTADMIN_ROLE_ID}> if you need assistance.`})
        return interaction.reply({embeds: [that.embeddedMessage]})
      }
    }
  }
}