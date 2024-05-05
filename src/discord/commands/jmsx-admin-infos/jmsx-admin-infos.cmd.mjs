import { SlashCommandBuilder } from 'discord.js'
import { getContentInfos, jsmxAdminInfoRow } from './jmsx-admin-infos.utils.mjs'

const cmd = {
  data: new SlashCommandBuilder()
    .setName('jmsx-admin-infos')
    .setDescription(
      'Toutes les infos sur JMSX, uniquement pour les rôles "jmsx" !'
    ),
  async execute(interaction) {
    const memberRoles = interaction.member.roles.cache.map((role) => role.name)

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
      components: [jsmxAdminInfoRow],
    })
  },
}

export default cmd
