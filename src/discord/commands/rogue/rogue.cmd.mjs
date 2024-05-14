import { SlashCommandBuilder } from 'discord.js'
import { mainMsg, mainRow } from './rogue.utils.mjs'

const cmd = {
  data: new SlashCommandBuilder()
    .setName('rogue')
    .setDescription('Tu veux jouer ?'),
  async execute(interaction) {
    return mainMsg(interaction, true)
  },
}

export default cmd
