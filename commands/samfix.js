const { EmbedBuilder, RoleSelectMenuBuilder } = require('discord.js');

const { Rcon } = require("rcon-client")
const dotenv = require('dotenv');
dotenv.config();

const mcServerIP = process.env.MC_SERVER_IP;
const mcRconPort = process.env.MC_RCON_PORT;
const mcRconPassword = process.env.MC_RCON_PASSWORD;

module.exports = {
  name: 'samfix',
  description: 'Kicks sam from the Minecraft server so he doesnt lose his gosh darn poop',
  usage: '',
  embeddedMessage: {
    color: 0x9013FE,
    title: 'EMMYBUNNMC SERVER',
    fields: []
  },
  process: () => {
    console.log("running samfix command")
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const rcon = await Rcon.connect({
            host: mcServerIP, port: mcRconPort, password: mcRconPassword
          })
          let responses = await Promise.all([
            rcon.send('kick Arc_Pri')
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
    run: async (client, interaction) => {
      const that = module.exports;
      that.embeddedMessage.fields = []
      if (interaction.member.roles.cache.has('1220157934990921791')) {
        that.process().then((responseField) => {
          that.embeddedMessage.fields.push({name: 'RCON Response', value: responseField})
          return interaction.reply({embeds: [that.embeddedMessage]})
        })
      } else {
        that.embeddedMessage.fields.push({name: 'only sam can do dis', value: ``})
        return interaction.reply({embeds: [that.embeddedMessage]})
      }
    }
  }
}