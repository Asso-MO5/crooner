import { CronJob } from 'cron'
import { sendJmsxTicketMail } from './src/jobs/jmsx/ticket-mail.mjs'
import { botStart } from './src/discord/discord.mjs'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'
import timezone from 'dayjs/plugin/timezone.js'
import duration from 'dayjs/plugin/duration.js'
import fr from 'dayjs/locale/fr.js'
import weekday from 'dayjs/plugin/weekday.js'
import { watchMail } from './src/services/watch-mail.mjs'
import { sendJmsxConfirmGenerate } from './src/jobs/jmsx/send-jmsx-confirm-generate.mjs'
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(weekday)
dayjs.locale(fr)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/Paris')

const sendJmsxTicketMailJob = new CronJob(
  '*/10 * * * *',
  sendJmsxTicketMail,
  () => console.log('sendJmsxTicketMail : ', 'Job done'),
  true, // start
  'Europe/Paris' // timeZone
)

const sendJmsxConfirmGeneratelJob = new CronJob(
  '*/5 * * * *',
  sendJmsxConfirmGenerate,
  () => console.log('sendJmsxTicketMail : ', 'Job done'),
  true, // start
  'Europe/Paris' // timeZone
)

const watchMailJob = new CronJob(
  '*/5 * * * *',
  watchMail,
  () => console.log('watchMail : ', 'Job done'),
  true, // start
  'Europe/Paris' // timeZone
)

async function start() {
  sendJmsxTicketMail()
  sendJmsxConfirmGenerate()
  sendJmsxConfirmGeneratelJob.start()
  const client = await botStart()

  watchMailJob.start()
  watchMail()
  console.log('Jobs started')
  sendJmsxTicketMailJob.start()
}

start()
