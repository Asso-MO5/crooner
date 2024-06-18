import { ActionRowBuilder, ButtonStyle } from 'discord.js'
import { tables } from '../../../jobs/jmsx/contants.mjs'
import { createServerClient } from '../../../services/supabase.mjs'
import {
  jsmxAdminRow,
  participationRow,
  returnBtn,
} from './jmsx-admin.utils.mjs'
import { ButtonBuilder } from 'discord.js'
import { JmsxAdminCustomId } from './jmsx-admin.custom-id.mjs'

export async function jsmxAdminStaffOptContent(interaction) {
  const supabase = createServerClient()
  const { data: staff } = await supabase.from(tables.staff).select('*')
  const me = staff.find((s) => s.discord_id === interaction.user.id)

  const members = Array.from(await interaction.guild.members.fetch()).filter(
    (m) => {
      const [_, member] = m
      return member.roles.cache.map((r) => r.name).includes('jmsx')
    }
  )

  const staffers = staff.map((st) => {
    const [_, member] = members.find(([id]) => id === st.discord_id)
    return {
      ...member.user,
      ...st,
    }
  })

  return `🚀 **JMSX Admin | STAFF ** 🚀
**Ma participation :**
-----------------------------
${me.day_one ? '✅' : '❌'} Samedi
${me.day_two ? '✅' : '❌'} Dimanche
-----------------------------
### NOM | Samedi | Dimanche
${staffers
  .map(
    (st) =>
      `- **${st.username}**  - ${st.day_zero ? '✅' : '❌'} - ${
        st.day_one ? '✅' : '❌'
      } - ${st.day_two ? '✅' : '❌'}\n`
  )
  .join('')}

| Crooner provided with ❤️ by Kazerlelutin |

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
      participationRow(me.day_zero, me.day_one, me.day_two),
      jsmxAdminRow,
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(JmsxAdminCustomId.gen_pass)
          .setLabel(`Générer mon pass`)
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(JmsxAdminCustomId.return)
          .setLabel(`Retour au menu principal`)
          .setStyle(ButtonStyle.Primary)
      ),
    ],
  })
}
