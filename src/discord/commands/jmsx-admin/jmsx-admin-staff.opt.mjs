import { tables } from '../../../jobs/jmsx/contants.mjs'
import { createServerClient } from '../../../services/supabase.mjs'
import { JmsxAdminCustomId } from './jmsx-admin.custom-id.mjs'
import {
  jsmxAdminRow,
  participationRow,
  returnBtn,
} from './jmsx-admin.utils.mjs'
import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js'

export async function jsmxAdminStaffOptContent(interaction) {
  const supabase = createServerClient()
  const { data: staff } = await supabase.from(tables.staff).select('*')
  const me = staff.find((s) => s.discord_id === interaction.user.id)

  return `🚀 **JMSX Admin | STAFF ** 🚀
**Ma participation :**
-----------------------------
${me.day_one ? '✅' : '❌'} Samedi
${me.day_two ? '✅' : '❌'} Dimanche
-----------------------------

_Stats provided with ❤️ by JMSX Kazerlelutin bot

-----------------------------`
}

export async function jsmxAdminStaffOpt(interaction) {
  const supabase = createServerClient()

  const { data: staff } = await supabase.from(tables.staff).select('*')

  const me = staff.find((s) => s.discord_id === interaction.user.id)

  if (!me) {
    await interaction.editReply({
      content: "Tu n'es pas dans la liste du staff !",
      components: [jsmxAdminRow, returnBtn],
    })
  }

  await interaction.editReply({
    content: await jsmxAdminStaffOptContent(interaction),
    components: [
      participationRow(me.day_one, me.day_two),
      jsmxAdminRow,
      returnBtn,
    ],
  })
}
