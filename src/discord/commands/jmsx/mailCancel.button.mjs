import { jsmxCustomId } from './jmsx.custom-id.mjs'

const btn = {
  customId: jsmxCustomId.cancel,
  async execute(interaction) {
    await interaction.deferUpdate()
    await interaction.deleteReply()
  },
}

export default btn
