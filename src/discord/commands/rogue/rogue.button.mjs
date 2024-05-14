import { rogueCustomId } from './rogue.custom-id.mjs'
import { game } from './rogue.game.mjs'

const btn = {
  customId: rogueCustomId.btn,
  async execute(interaction) {
    await interaction.deferUpdate()

    if (interaction.customId === rogueCustomId.score) {
      await interaction.editReply({
        content: 'Tableau des scores',
      })

      return
    }

    if (
      interaction.customId === rogueCustomId.play ||
      interaction.customId.match(/rogue-btn-ctrl/)
    )
      return await game(interaction)
  },
}
export default btn
