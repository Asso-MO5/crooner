import { ButtonBuilder, ButtonStyle } from 'discord.js'
import { tables } from '../../../jobs/jmsx/contants.mjs'
import { createServerClient } from '../../../services/supabase.mjs'
import { JmsxAdminInfosCustomId } from './jmsx-admin-infos.custom-id.mjs'
import {
  getContentInfos,
  jsmxAdminInfoRow,
  typeOfVisitors,
} from './jmsx-admin-infos.utils.mjs'
import { ActionRowBuilder } from 'discord.js'

const btn = {
  customId: JmsxAdminInfosCustomId.button,
  execute: async (interaction) => {
    await interaction.deferUpdate()

    if (interaction.customId === JmsxAdminInfosCustomId.return) {
      await interaction.editReply({
        content: await getContentInfos(),
        components: [jsmxAdminInfoRow],
      })
      return
    }

    const returnBtn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(JmsxAdminInfosCustomId.return)
        .setLabel(`Retour au menu principal`)
        .setStyle(ButtonStyle.Primary)
    )

    const type = interaction.customId.split('-').pop()

    const supabase = createServerClient()
    const { data: seats } = await supabase
      .from(tables.seats)
      .select('*')
      .eq('type', type)

    if (!seats.length) {
      await interaction.editReply({
        content:
          '----\n\n' +
          'Aucun **' +
          typeOfVisitors[type].name +
          '** pour le moment !\n\n' +
          '----',

        components: [jsmxAdminInfoRow, returnBtn],
      })
      return
    }

    const content = [
      '----',
      '\n\n',
      '**' + typeOfVisitors[type].name + ' (' + seats.length + ')**',
      '\n\n',
      seats
        .map((seat) => {
          return [
            '- **',
            seat.lastname?.toUpperCase() + '',
            seat.name + '** | ',
            seat.email + ' | ',
            seat.pack_name,
          ].join(' ')
        })
        .join('\n'),
      '\n\n',
      '----',
    ]

    await interaction.editReply({
      content: content.join(''),
      components: [jsmxAdminInfoRow, returnBtn],
    })
  },
}

export default btn
