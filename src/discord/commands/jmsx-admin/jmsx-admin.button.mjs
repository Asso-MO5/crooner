import { tables } from '../../../jobs/jmsx/contants.mjs'
import { createServerClient } from '../../../services/supabase.mjs'
import { jsmxAdminSeatsOpt } from './jmsx-admin-seats.opt.mjs'
import { jsmxAdminStaffOptContent } from './jmsx-admin-staff.opt.mjs'
import { JmsxAdminCustomId } from './jmsx-admin.custom-id.mjs'
import {
  getContentInfos,
  jsmxAdminRow,
  participationRow,
  returnBtn,
} from './jmsx-admin.utils.mjs'
import {
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder,
} from 'discord.js'

const btn = {
  customId: JmsxAdminCustomId.button,
  execute: async (interaction) => {
    if (interaction.customId !== JmsxAdminCustomId.addGuest) {
      await interaction.deferUpdate()
    }

    // === Seats ===
    if (interaction.customId.includes(JmsxAdminCustomId.pagination_seats)) {
      const page = interaction.customId.split('-').pop()
      const type = interaction.customId.replace(`-${page}`, '').split('-').pop()
      return await interaction.editReply({
        content: await jsmxAdminSeatsOpt(interaction, type, page),
      })
    }

    // === Return ===

    if (interaction.customId === JmsxAdminCustomId.return) {
      return await interaction.editReply({
        content: await getContentInfos(),
        components: [jsmxAdminRow],
      })
    }

    // === Guests participation ===
    if (interaction.customId === JmsxAdminCustomId.addGuest) {
      const modal = new ModalBuilder()
        .setCustomId(JmsxAdminCustomId.addGuestModal)
        .setTitle('Ajouter un invité')

      const rows = [
        new TextInputBuilder()
          .setCustomId(JmsxAdminCustomId.addGuestFields.id)
          .setRequired(false)
          .setLabel("ID de l'invité")
          .setPlaceholder('pour modification uniquement')
          .setStyle(TextInputStyle.Short),
        new TextInputBuilder()
          .setCustomId(JmsxAdminCustomId.addGuestFields.name)
          .setLabel("Nom de l'invité")
          .setRequired(false)
          .setStyle(TextInputStyle.Short),
        new TextInputBuilder()
          .setCustomId(JmsxAdminCustomId.addGuestFields.day_one)
          .setLabel('Samedi')
          .setRequired(false)
          .setPlaceholder('true/false | ✅/❌ | oui/non | o/n')
          .setStyle(TextInputStyle.Short),
        new TextInputBuilder()
          .setCustomId(JmsxAdminCustomId.addGuestFields.day_two)
          .setLabel('Dimanche')
          .setRequired(false)
          .setPlaceholder('true/false | ✅/❌ | oui/non | o/n')
          .setStyle(TextInputStyle.Short),
        new TextInputBuilder()
          .setCustomId(JmsxAdminCustomId.addGuestFields.description)
          .setLabel('infos')
          .setRequired(false)
          .setPlaceholder('Ajouter des infos supplémentaires ici...')
          .setStyle(TextInputStyle.Paragraph),
      ]

      modal.addComponents(
        ...rows.map((row) => new ActionRowBuilder().addComponents(row))
      )

      return await interaction.showModal(modal)
    }

    // === Staff participation ===

    if (
      interaction.customId === JmsxAdminCustomId.participation.day_one ||
      interaction.customId === JmsxAdminCustomId.participation.day_two
    ) {
      const day = `day_${interaction.customId.split('-').pop()}`
      const supabase = createServerClient()
      const { data: me } = await supabase
        .from(tables.staff)
        .select('*')
        .eq('discord_id', interaction.user.id)
        .single()

      me[day] = !me[day]
      await supabase
        .from(tables.staff)
        .update({
          [day]: me[day],
        })
        .eq('discord_id', interaction.user.id)

      return await interaction.editReply({
        content: await jsmxAdminStaffOptContent(interaction),
        components: [
          participationRow(me.day_one, me.day_two),
          jsmxAdminRow,
          returnBtn,
        ],
      })
    }

    await interaction.editReply({
      content: 'aucune action définie pour ce bouton !',
      components: [jsmxAdminRow, returnBtn],
    })
  },
}

export default btn
