const prefix = 'jmsx-admin'
export const JmsxAdminCustomId = {
  selector: `${prefix}-selector`,
  list: {
    visitors: `${prefix}-list-visitors`,
    exhibitors: `${prefix}-list-exhibitors`,
    students: `${prefix}-list-students`,
    gamJam: `${prefix}-list-gamJam`,
    staff: `${prefix}-list-staff`,
    guests: `${prefix}-list-guests`,
  },
  per_day: {
    day_one: `${prefix}-per-day-one`,
    day_two: `${prefix}-per-day-two`,
  },
  return: `${prefix}-return`,
  button: prefix,
  participation: {
    day_one: `${prefix}-participation-day-one`,
    day_two: `${prefix}-participation-day-two`,
  },
  pagination_seats: `${prefix}-pagination-seats`,
  addGuestModal: `${prefix}-add-guest-modal`,
  addGuest: `${prefix}-add-guest`,
  deleteGuest: `${prefix}-delete-guest`,
  deleteGuestModal: `${prefix}-delete-guest-modal`,
  deleteGuestFields: {
    id: `${prefix}-delete-guest-id`,
    confirm: `${prefix}-delete-guest-confirm`,
  },
  addGuestFields: {
    id: `${prefix}-add-guest-id`,
    name: `${prefix}-add-guest-name`,
    day_one: `${prefix}-add-guest-day_one`,
    day_two: `${prefix}-add-guest-day_two`,
    description: `${prefix}-add-guest-description`,
  },
}
