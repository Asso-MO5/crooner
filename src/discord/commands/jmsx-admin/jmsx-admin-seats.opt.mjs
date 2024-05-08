import { tables } from '../../../jobs/jmsx/contants.mjs'
import { createServerClient } from '../../../services/supabase.mjs'
import { typeOfVisitorsJmsx } from '../../utils.mjs'
import { jsmxAdminRow, returnBtn } from './jmsx-admin.utils.mjs'

export async function jsmxAdminSeatsOpt(interaction) {
  const customId = interaction.values[0]
  const type = customId.split('-').pop()

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
        typeOfVisitorsJmsx[type].name +
        '** pour le moment !\n\n' +
        '----',

      components: [jsmxAdminRow, returnBtn],
    })
    return
  }

  const content = [
    '----',
    '\n\n',
    '**' + typeOfVisitorsJmsx[type].name + ' (' + seats.length + ')**',
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
    components: [jsmxAdminRow, returnBtn],
  })
}
