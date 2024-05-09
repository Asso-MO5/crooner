import { tables } from '../../../jobs/jmsx/contants.mjs'
import { createServerClient } from '../../../services/supabase.mjs'
import { jsmxAdminGuestOptContent } from './jmsx-admin-guests.opt.mjs'
import { JmsxAdminCustomId } from './jmsx-admin.custom-id.mjs'

const modal = {
  customId: JmsxAdminCustomId.deleteGuestModal,
  async execute(interaction) {
    await interaction.deferUpdate()

    const form = Object.values(JmsxAdminCustomId.deleteGuestFields).reduce(
      (acc, field) => {
        return {
          [field.split('-').pop()]: interaction.fields.getTextInputValue(field),
          ...acc,
        }
      },
      {}
    )

    if (form.confirm !== 'SUPPRIMER') {
      return interaction.editReply({
        content:
          '**Vous devez confirmer la suppression en écrivant "SUPPRIMER"**\n\n' +
          (await jsmxAdminGuestOptContent()),
      })
    }

    const supabase = createServerClient()

    const { data: guest } = await supabase
      .from(tables.guests)
      .select('id')
      .eq('id', form.id)
      .single()

    const { data: guestName } = await supabase
      .from(tables.guests)
      .select('id')
      .eq('name', form.id)
      .single()

    if (!guest?.id && !guestName?.id) {
      return interaction.editReply({
        content:
          '**Aucun invité trouvé avec cet ID et ce nom**\n\n' +
          (await jsmxAdminGuestOptContent()),
      })
    }

    await supabase.from(tables.guests).delete().eq('id', form.id)
    await supabase.from(tables.guests).delete().eq('name', form.id)

    interaction.editReply({
      content: await jsmxAdminGuestOptContent(),
    })
  },
}

export default modal
