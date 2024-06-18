import { tables } from '../../../jobs/jmsx/contants.mjs'
import { createServerClient } from '../../../services/supabase.mjs'
import { JmsxAdminCustomId } from './jmsx-admin.custom-id.mjs'
import { jsmxAdminRow, returnBtn } from './jmsx-admin.utils.mjs'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

export async function jsmxAdminGuestOptContent() {
  const supabase = createServerClient()
  const { data: guests } = await supabase.from(tables.guests).select('*')

  return `🚀 **JMSX Admin | ${'invité'.toLocaleUpperCase()} ** 🚀
### NOM | Vendredi | Samedi | Dimanche
${guests.length ? '' : 'Aucun invité pour le moment !'}
${guests
  .map(
    (st) =>
      `- \`${st.id}\` **${st.name}** - ${st.day_one ? '✅' : '❌'} - ${
        st.day_two ? '✅' : '❌'
      }\n`
  )
  .join('')}

| Crooner provided with ❤️ by Kazerlelutin |

-----------------------------`
}

export function jsmxAdminGuestAddModal(interaction) {
  interaction.editReply({
    content: jsmxAdminGuestOptContent(),
    components: [jsmxAdminRow, returnBtn],
  })
}

export const modalBtn = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId(JmsxAdminCustomId.addGuest)
    .setLabel(`Ajouter / modifier un invité`)
    .setStyle(ButtonStyle.Success),
  new ButtonBuilder()
    .setCustomId(JmsxAdminCustomId.deleteGuest)
    .setLabel(`Supprimer un invité`)
    .setStyle(ButtonStyle.Danger)
)

export async function jsmxAdminGuestsOpt(interaction) {
  await interaction.editReply({
    content: await jsmxAdminGuestOptContent(),
    components: [modalBtn, jsmxAdminRow, returnBtn],
  })
}
