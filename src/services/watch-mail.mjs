import imaps from 'imap-simple'

const config = {
  imap: {
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASS,
    host: process.env.MAIL_HOST,
    port: 143,
    tls: false,
    authTimeout: 3000,
  },
}

let imp = null

export async function watchMail() {
  if (imp) return

  imaps.connect(config).then((connection) => {
    console.log('Connected email inbox')
    imp = connection
    return connection.openBox('INBOX').then(async () => {
      const searchCriteria = ['UNSEEN']

      const fetchOptions = {
        bodies: ['HEADER', 'TEXT'],
        markSeen: false,
      }

      const results = await connection.search(searchCriteria, fetchOptions)

      for (const result of results) {
        const subject = result.parts.find((part) => {
          return part.which === 'HEADER'
        })?.body.subject[0]

        const from = result.parts.find((part) => {
          return part.which === 'HEADER'
        })?.body.from[0]

        const body = result.parts.find((part) => {
          return part.which === 'TEXT'
        })?.body

        const content = body
          .split('\n')
          .filter((p) => {
            const part = p.trim()
            if (part.startsWith('Content-')) return false
            if (part.startsWith('--_000_')) return false
            if (part.startsWith('--00000000')) return false
            if (part.match(/<[^>]+/)) return false
            if (part.match(/[^>]>+/)) return false
            if (part.match(/font-size:/)) return false

            return true
          })
          .join('\n')

        await fetch(process.env.DISCORD_HOOK || '', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: `
      --------------------------------
      **Nouvel email**
      **Sujet**: ${subject}
      **Email**: ${from}
      **Message**
      ${content}
      `,
          }),
        })

        connection.moveMessage(result.attributes.uid, 'INBOX.Discord', () => {})
      }
      connection.end()
    })
  })
}
