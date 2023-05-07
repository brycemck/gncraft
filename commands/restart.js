const { exec } = require('child_process');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  name: 'restart',
  description: 'Restart the Minecraft service. Note: this does restart the virtual machine, just the service itself.',
  usage: '',
  embeddedMessage: {
    color: 0x0099FF,
    title: 'GaynadianCraft',
    fields: [],
    timestamp: new Date().toISOString()
  },
  process: () => {
    return new Promise((resolve, reject) => {
      exec('bash /opt/restart-server.sh 9', (err, stdout, stderr) => {
        if (err) {
          reject(err)
        } else {
          console.log(stderr)
          console.log(stdout)
          resolve('Sucessfully restarted the service, please wait a few minutes.')
        }
      })
    })
  },
  SlashCommand: {
    options: [],
    run: async (client, interaction) => {
      const that = module.exports;

      that.embeddedMessage.fields = [];
      that.process().then((response) => {
        that.embeddedMessage.fields.push({name: 'Restarting Minecraft service...', value: `\`${response}\``})
        return interaction.reply({embeds: [that.embeddedMessage]})
      }).catch((err) => {
        that.embeddedMessage.fields.push({name: 'Error running restart', value: `\`${err}\``})
        return interaction.reply({embeds: [that.embeddedMessage]})
      })
    }
  }
}