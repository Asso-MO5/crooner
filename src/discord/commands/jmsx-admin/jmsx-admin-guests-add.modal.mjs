import { tables } from '../../../jobs/jmsx/contants.mjs'
import { createServerClient } from '../../../services/supabase.mjs'
import { jsmxAdminGuestOptContent, modalBtn } from './jmsx-admin-guests.opt.mjs'
import { JmsxAdminCustomId } from './jmsx-admin.custom-id.mjs'
import { jsmxAdminRow, returnBtn } from './jmsx-admin.utils.mjs'

function checkDay(day, defaultValue = false) {
  if (!day) return defaultValue
  return /^(true|oui|o|✅|1)$/i.test(day)
}

const modal = {
  customId: JmsxAdminCustomId.addGuestModal,
  async execute(interaction) {
    await interaction.deferUpdate()

    const form = Object.values(JmsxAdminCustomId.addGuestFields).reduce(
      (acc, field) => {
        return {
          [field.split('-').pop()]: interaction.fields.getTextInputValue(field),
          ...acc,
        }
      },
      {}
    )

    const supabase = createServerClient()

    if (form.id) {
      const { data: guest } = await supabase
        .from(tables.guests)
        .select('*')
        .eq('id', form.id)
        .single()

      if (guest) {
        await supabase
          .from(tables.guests)
          .update({
            day_one: checkDay(form.day_one, guest.day_one),
            day_two: checkDay(form.day_two, guest.day_two),
            description: form.description || guest.description,
          })
          .eq('id', form.id)
      }
    } else {
      const { data: guest } = await supabase
        .from(tables.guests)
        .select('*')
        .match({ name: form.name })
        .single()

      if (guest) {
        await supabase
          .from(tables.guests)
          .update({
            day_one: checkDay(form.day_one, guest.day_one),
            day_two: checkDay(form.day_two, guest.day_two),
            description: form.description || guest.description,
          })
          .match({ name: form.name })
      } else {
        await supabase.from(tables.guests).insert([
          {
            name: form.name,
            day_one: checkDay(form.day_one),
            day_two: checkDay(form.day_two),
            description: form.description || '',
          },
        ])
      }
    }

    // Get the data entered by the user

    interaction.editReply({
      content: await jsmxAdminGuestOptContent(),
      components: [modalBtn, jsmxAdminRow, returnBtn],
    })
  },
}

export default modal
