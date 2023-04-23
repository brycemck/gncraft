const { EmbedBuilder } = require('discord.js');

const mcUtil = require('minecraft-server-util');
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
    color: 0x0099FF,
    title: 'GaynadianCraft',
    fields: [],
    timestamp: new Date().toISOString()
  },
  process: (command) => {
    return new Promise((resolve, reject) => {
      const RCONClient = new mcUtil.RCON();

      (async () => {
        try {
          await RCONClient.connect(mcServerIP, parseInt(mcRconPort));
        } catch(error) {
          reject(error);
        }
        await RCONClient.login(mcRconPassword);
        
        const result = await RCONClient.execute(command);

        await RCONClient.close();
        resolve(result)
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
      if (interaction.member.roles.cache.has(process.env.DISCORD_MINECRAFTADMIN_ROLE_ID)) {
        if (interaction.options.getString('command')) {
          that.process(interaction.options.getString('command')).then((responseField) => {
            that.embeddedMessage.fields.push({name: 'RCON Response', value: responseField})
            return interaction.reply({embeds: [that.embeddedMessage]})
          })
        }
      } else {
        that.embeddedMessage.fields.push({name: 'You must be a Minecraft Admin to do this.', value: `Please tag @${DISCORD_MINECRAFTADMIN_ROLE_NAME} if you need assistance.`})
        return interaction.reply({embeds: [that.embeddedMessage]})
      }
    }
  }
}