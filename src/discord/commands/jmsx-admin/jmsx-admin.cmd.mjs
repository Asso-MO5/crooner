import { SlashCommandBuilder } from 'discord.js'
import { getContentInfos, jsmxAdminRow } from './jmsx-admin.utils.mjs'
import { createServerClient } from '../../../services/supabase.mjs'
import { tables } from '../../../jobs/jmsx/contants.mjs'

const cmd = {
  data: new SlashCommandBuilder()
    .setName('jmsx-admin')
    .setDescription('Panneau admin JMSX, uniquement pour les rôles "jmsx" !'),
  async execute(interaction) {
    const memberRoles = interaction.member.roles.cache.map((role) => role.name)

    const supabase = createServerClient()
    const { data: IamHere } = await supabase
      .from(tables.staff)
      .select('*')
      .eq('discord_id', interaction.user.id)
      .single()

    // If the user is not in the staff table, we add him
    if (!IamHere) {
      await supabase.from(tables.staff).insert([
        {
          discord_id: interaction.user.id,
          day_one: false,
          day_two: false,
        },
      ])
    }

    if (!memberRoles.includes('jmsx')) {
      await interaction.reply({
        content: `Tu n'es pas autorisé à utiliser cette commande ! 😡`,
        ephemeral: true,
      })
      return
    }

    await interaction.reply({
      content: await getContentInfos(),
      ephemeral: true,
      components: [jsmxAdminRow],
    })
  },
}

export default cmd
