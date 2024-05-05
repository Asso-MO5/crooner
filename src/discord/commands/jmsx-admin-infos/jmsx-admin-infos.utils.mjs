import { createServerClient } from '../../../services/supabase.mjs'
import { tables } from '../../../jobs/jmsx/contants.mjs'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { JmsxAdminInfosCustomId } from './jmsx-admin-infos.custom-id.mjs'

export const typeOfVisitors = {
  visitors: {
    name: 'Visiteurs',
    seat: 65,
    price: 10,
    emoji: '👥',
  },
  exhibitors: {
    name: 'Exposants',
    seat: 10,
    price: 15,
    emoji: '🎪',
  },
  students: {
    name: 'Etudiants ISART',
    seat: 20,
    price: 0,
    emoji: '🎓',
  },
  gamJam: {
    name: 'Etudiants ISART - Game Jam',
    seat: 20,
    price: 0,
    emoji: '🕹',
  },
}

export function createAsciiBar(percentage) {
  const filledLength = Math.round(percentage / 10) // chaque 10% est un caractère rempli
  const emptyLength = 10 - filledLength
  const filledBar = '█'.repeat(filledLength)
  const emptyBar = '░'.repeat(emptyLength)
  return `${filledBar}${emptyBar} ${percentage}%`
}

export async function getContentInfos() {
  const supabase = createServerClient()
  const { data: seats } = await supabase.from(tables.seats).select('*')

  const totalSeats = seats.length

  const totalSeatsDayOne = seats.filter((seat) => seat.day_one).length
  const totalSeatsDayTwo = seats.filter((seat) => seat.day_two).length

  const visitors = seats.filter((seat) => seat.type === 'visitors').length
  const exhibitors = seats.filter((seat) => seat.type === 'exhibitors').length
  const students = seats.filter((seat) => seat.type === 'students').length
  const gamJammers = seats.filter((seat) => seat.game_jam).length

  const percents = {
    visitors: ((visitors / totalSeats) * 100).toFixed(2),
    exhibitors: ((exhibitors / totalSeats) * 100).toFixed(2),
    students: ((students / totalSeats) * 100).toFixed(2),
    gamJammers: ((gamJammers / totalSeats) * 100).toFixed(2),
  }

  const bank = seats.reduce((acc, seat) => acc + seat.amount, 0)
  return `🚀 **JMSX Admin Dashboard** 🚀

**Total de Tickets vendus**: ${totalSeats} 🎫

📅 **Samedi**: ${totalSeatsDayOne}
📅 **Dimanche**: ${totalSeatsDayTwo}

**Types de visiteurs**:
${typeOfVisitors.visitors.emoji} Visiteurs: ${visitors} ${createAsciiBar(
    percents.visitors
  )}
${typeOfVisitors.exhibitors.emoji} Exposants: ${exhibitors} ${createAsciiBar(
    percents.exhibitors
  )}
${typeOfVisitors.students.emoji} Etudiants: ${students} ${createAsciiBar(
    percents.students
  )}
${typeOfVisitors.gamJam.emoji} Game Jammers: ${gamJammers} ${createAsciiBar(
    percents.gamJammers
  )}

💰 **Banque**: ${bank.toFixed(0)}€

🔹 **Jauges**:
- Visiteurs: ${visitors} / ${typeOfVisitors.visitors.seat} (**${(
    (visitors / typeOfVisitors.visitors.seat) *
    100
  ).toFixed(0)}%**)
- Exposants: ${exhibitors} / ${typeOfVisitors.exhibitors.seat} (**${(
    (exhibitors / typeOfVisitors.exhibitors.seat) *
    100
  ).toFixed(0)}%**)
- Etudiants / Game Jammers: ${students} / ${typeOfVisitors.students.seat} (**${(
    (students / typeOfVisitors.students.seat) *
    100
  ).toFixed(0)}%**)

_Stats provided with ❤️ by JMSX Kazerlelutin bot

`
}

export const jsmxAdminInfoRow = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId(JmsxAdminInfosCustomId.list.visitors)
    .setLabel(`${typeOfVisitors.visitors.emoji} Visiteurs`)
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId(JmsxAdminInfosCustomId.list.exhibitors)
    .setLabel(`${typeOfVisitors.exhibitors.emoji} Exposants`)
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId(JmsxAdminInfosCustomId.list.students)
    .setLabel(`${typeOfVisitors.students.emoji} Etudiants`)
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId(JmsxAdminInfosCustomId.list.gamJam)
    .setLabel(`${typeOfVisitors.gamJam.emoji} Gam Jammers`)
    .setStyle(ButtonStyle.Secondary)
)
