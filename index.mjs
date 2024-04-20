import { CronJob } from 'cron'
import { sendJmsxTicketMail } from './src/jobs/jmsx/ticket-mail.mjs'

const job = new CronJob(
  '*/10 * * * *',
  sendJmsxTicketMail,
  () => console.log('sendJmsxTicketMail : ', 'Job done'),
  true, // start
  'Europe/Paris' // timeZone
)
console.log('Jobs started')
job.start()
