import { tables } from '../../../jobs/jmsx/contants.mjs'
import { createServerClient } from '../../../services/supabase.mjs'
import { typeOfVisitorsJmsx } from '../../utils.mjs'
import {
  createPaginationSeats,
  jsmxAdminRow,
  returnBtn,
} from './jmsx-admin.utils.mjs'

export async function jsmxAdminSeatsOpt(interaction, _type, page = 1) {
  const type = _type || interaction.values[0].split('-').pop()
  const perPage = 20

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
      .slice((page - 1) * perPage, page * perPage)
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
    '===  **1** / ' + Math.ceil(seats.length / perPage) + '  ===\n\n',
    '----',
  ]

  const noNext = page * perPage >= seats.length
  const noPagination = seats.length <= perPage

  const rows = []
  if (!noPagination) {
    rows.push(createPaginationSeats(type, page, noNext))
  }

  rows.push(jsmxAdminRow, returnBtn)

  await interaction.editReply({
    content: content.join(''),
    components: rows,
  })
}
