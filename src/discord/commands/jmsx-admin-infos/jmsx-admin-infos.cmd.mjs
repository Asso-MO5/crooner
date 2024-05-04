import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} from 'discord.js'
import { createServerClient } from '../../../services/supabase.mjs'
import { tables } from '../../../jobs/jmsx/contants.mjs'

const typeOfVisitors = {
  visitors: {
    name: 'Visiteurs',
    seat: 65,
    price: 10,
  },
  exhibitors: {
    name: 'Exposants',
    seat: 10,
    price: 15,
  },
  students: {
    name: 'Etudiants ISART',
    seat: 20,
    price: 0,
  },
  gamJam: {
    name: 'Etudiants ISART - Game Jam',
    seat: 20,
    price: 0,
  },
}

function createAsciiBar(percentage) {
  const filledLength = Math.round(percentage / 10) // chaque 10% est un caractère rempli
  const emptyLength = 10 - filledLength
  const filledBar = '█'.repeat(filledLength)
  const emptyBar = '░'.repeat(emptyLength)
  return `${filledBar}${emptyBar} ${percentage}%`
}

const cmd = {
  data: new SlashCommandBuilder()
    .setName('jmsx-admin-infos')
    .setDescription(
      'Toutes les infos sur JMSX, uniquement pour les rôles "jmsx" !'
    ),
  async execute(interaction) {
    // ICI je récupère les roles de l'utilisateur qui utilise la commande
    const memberRoles = interaction.member.roles.cache.map((role) => role.name)

    if (!memberRoles.includes('jmsx')) {
      await interaction.reply({
        content: `Tu n'es pas autorisé à utiliser cette commande ! 😡`,
        ephemeral: true,
      })
      return
    }

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

    await interaction.reply({
      content: `🚀 **JMSX Admin Dashboard** 🚀

**Total de Tickets vendus**: ${totalSeats} 🎫

📅 **Samedi**: ${totalSeatsDayOne}
📅 **Dimanche**: ${totalSeatsDayTwo}

**Types de visiteurs**:
👥 Visiteurs: ${visitors} ${createAsciiBar(percents.visitors)}
🎪 Exposants: ${exhibitors} ${createAsciiBar(percents.exhibitors)}
🎓 Etudiants: ${students} ${createAsciiBar(percents.students)}
🕹 Game Jammers: ${gamJammers} ${createAsciiBar(percents.gamJammers)}

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


_Stats provided with ❤️ by JMSX Kazerlelutin bot`,
      ephemeral: true,
      // Uncomment and replace `row` with your actual components if needed
      // components: [row],
    })
  },
}

export default cmd
