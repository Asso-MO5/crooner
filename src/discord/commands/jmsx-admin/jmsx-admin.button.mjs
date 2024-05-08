import { JmsxAdminCustomId } from './jmsx-admin.custom-id.mjs'
import {
  getContentInfos,
  jsmxAdminRow,
  returnBtn,
} from './jmsx-admin.utils.mjs'

const btn = {
  customId: JmsxAdminCustomId.button,
  execute: async (interaction) => {
    await interaction.deferUpdate()

    if (interaction.customId === JmsxAdminCustomId.return) {
      await interaction.editReply({
        content: await getContentInfos(),
        components: [jsmxAdminRow],
      })
      return
    }

    if (
      interaction.customId === JmsxAdminCustomId.participation.day_one ||
      interaction.customId === JmsxAdminCustomId.participation.day_two
    ) {
      await interaction.editReply({
        content: 'auc--- !' + JmsxAdminCustomId.participation.day_two,
        components: [jsmxAdminRow, returnBtn],
      })
      return
    }

    await interaction.editReply({
      content: 'aucune action définie pour ce bouton !',
      components: [jsmxAdminRow, returnBtn],
    })
  },
}

export default btn
