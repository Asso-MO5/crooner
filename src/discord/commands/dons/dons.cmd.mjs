import { SlashCommandBuilder } from 'discord.js'
import { donRow, homeContent } from './dons.utils.mjs'

const cmd = {
  data: new SlashCommandBuilder()
    .setName('dons')
    .setDescription('Tout savoir sur les dons !'),
  async execute(interaction) {
    await interaction.reply({
      content: homeContent,
      ephemeral: true,
      components: [donRow],
    })
  },
}

export default cmd
