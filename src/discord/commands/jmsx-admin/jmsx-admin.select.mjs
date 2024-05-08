import { JmsxAdminCustomId } from './jmsx-admin.custom-id.mjs'
import { jsmxAdminStaffOpt } from './jmsx-admin-staff.opt.mjs'
import { jsmxAdminSeatsOpt } from './jmsx-admin-seats.opt.mjs'
import { jsmxAdminGuestsOpt } from './jmsx-admin-guests.opt.mjs'

const select = {
  customId: JmsxAdminCustomId.selector,
  execute: async (interaction) => {
    await interaction.deferUpdate()
    const customId = interaction.values[0]

    if (customId === JmsxAdminCustomId.list.staff)
      return await jsmxAdminStaffOpt(interaction)

    if (customId === JmsxAdminCustomId.list.guests)
      return await jsmxAdminGuestsOpt(interaction)

    return await jsmxAdminSeatsOpt(interaction)
  },
}

export default select
