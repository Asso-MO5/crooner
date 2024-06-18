import { tables } from '../../../jobs/jmsx/contants.mjs'
import { createServerClient } from '../../../services/supabase.mjs'
import {
  jsmxAdminRow,
  participationRow,
  returnBtn,
  returnBtnWithGenPass,
} from './jmsx-admin.utils.mjs'

export async function jsmxAdminStaffOptContent(interaction) {
  const supabase = createServerClient()
  const { data: staff } = await supabase.from(tables.staff).select('*')
  const me = staff.find((s) => s.discord_id === interaction.user.id)

  const discordMembers = await interaction.guild.members.fetch()

  const members = Array.from(discordMembers).filter((m) => {
    const [_, member] = m
    return member.roles.cache.map((r) => r.name).includes('jmsx')
  })

  const staffers = staff.map((st) => {
    const res = members.find(([id]) => id === st.discord_id)
    if (!res)
      return {
        ...st,
        unknows: true,
      }
    const [_, member] = res
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
  .filter((st) => !st.unknows)
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
      returnBtnWithGenPass,
    ],
  })
}
