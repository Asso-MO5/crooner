import { createServerClient } from '../../../services/supabase.mjs'
import { tables } from '../../../jobs/jmsx/contants.mjs'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { JmsxAdminCustomId } from './jmsx-admin.custom-id.mjs'
import { typeOfVisitorsJmsx } from '../../utils.mjs'
import { StringSelectMenuBuilder } from 'discord.js'
import { StringSelectMenuOptionBuilder } from 'discord.js'

export async function getContentInfos() {
  const supabase = createServerClient()
  const { data: seats } = await supabase.from(tables.seats).select('*')
  const { data: staff } = await supabase.from(tables.staff).select('*')
  const { data: guests } = await supabase.from(tables.guests).select('*')

  // === Total seats ===
  const totalDayOne =
    seats.filter((seat) => seat.day_one).length +
    guests.filter((guest) => guest.day_one).length +
    staff.filter((st) => st.day_one).length
  const totalDayTwo =
    seats.filter((seat) => seat.day_two).length +
    guests.filter((guest) => guest.day_two).length +
    staff.filter((st) => st.day_two).length

  const presents = (day) => {
    const key = day === 'day_one' ? 'day_one' : 'day_two'
    return {
      visitors: seats.filter((seat) => seat.type === 'visitors' && seat[key])
        .length,
      exhibitors: seats.filter(
        (seat) => seat.type === 'exhibitors' && seat[key]
      ).length,
      students: seats.filter((seat) => seat.type === 'students' && seat[key])
        .length,
      gamJam: seats.filter((seat) => seat.game_jam && seat[key]).length,
      staff: staff.filter((st) => st[key]).length,
      guests: guests.filter((guest) => guest[key]).length,
    }
  }

  const dayOne = presents('day_one')
  const dayTwo = presents('day_two')

  const list = (obj) =>
    Object.entries(obj)
      .map(([key, value]) => {
        const type = typeOfVisitorsJmsx[key]
        return `- ${type.emoji}  **${value}/${type.seat}**  ${type.name} *${(
          (value / type.seat) *
          100
        ).toFixed(0)}%*`
      })
      .join('\n')

  const bank = seats.reduce((acc, seat) => acc + seat.amount, 0)
  return `🚀 **JMSX Admin Dashboard** 🚀

-----------------------------
🎫 **Tickets** : ${seats.length} 
💰 **Banque**: ${bank.toFixed(0)}€
-----------------------------
## SAMEDI
-----------------------------
**TOTAL** : ${totalDayOne}
${list(dayOne)}
## DIMANCHE
-----------------------------
**TOTAL** : ${totalDayTwo}
${list(dayTwo)}

| Crooner provided with ❤️ by Kazerlelutin |

-----------------------------

`
}

export function createPaginationSeats(type, _page, noNext = false) {
  const row = []
  const page = parseInt(_page)
  if (page > 1) {
    row.push(
      new ButtonBuilder()
        .setCustomId(
          `${JmsxAdminCustomId.pagination_seats}-${type}-${page - 1}`
        )
        .setLabel(`Précédent`)
        .setStyle(ButtonStyle.Secondary)
    )
  }

  if (noNext) return new ActionRowBuilder().addComponents(...row)
  row.push(
    new ButtonBuilder()
      .setCustomId(`${JmsxAdminCustomId.pagination_seats}-${type}-${page + 1}`)
      .setLabel(`Suivant`)
      .setStyle(ButtonStyle.Secondary)
  )

  return new ActionRowBuilder().addComponents(...row)
}

export function participationRow(day_zero, day_one, day_two) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(JmsxAdminCustomId.participation.day_zero)
      .setLabel(
        day_zero ? 'Je ne viens pas' + ' vendredi' : 'Je viens' + ' vendredi'
      )
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(JmsxAdminCustomId.participation.day_one)
      .setLabel(
        day_one ? 'Je ne viens pas' + ' samedi' : 'Je viens' + ' samedi'
      )
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(JmsxAdminCustomId.participation.day_two)
      .setLabel(
        day_two ? 'Je ne viens pas' + ' dimanche' : 'Je viens' + ' dimanche'
      )
      .setStyle(ButtonStyle.Primary)
  )
}

export const returnBtn = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId(JmsxAdminCustomId.return)
    .setLabel(`Retour au menu principal`)
    .setStyle(ButtonStyle.Primary)
)

export const jsmxAdminRow = new ActionRowBuilder().addComponents(
  new StringSelectMenuBuilder()
    .setCustomId(JmsxAdminCustomId.selector)
    .setPlaceholder('Choisissez une action')
    .addOptions(
      Object.keys(typeOfVisitorsJmsx).map((key) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(
            `${typeOfVisitorsJmsx[key].emoji} ${typeOfVisitorsJmsx[key].name}`
          )
          .setValue(JmsxAdminCustomId.list[key])
      )
    )
)
